import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useRoomInfo } from './room-info/useRoomInfo';

interface EmotionSnapshot {
  timeRange: string;
  engagement: 'Positive' | 'Negative' | 'Neutral';
  percentage: number;
  participantCount: number;
  summary: string;
}

const EmotionSnapshotContext = createContext<EmotionSnapshot[]>([]);

export const useEmotionSnapshots = () => useContext(EmotionSnapshotContext);

export const EmotionSnapshotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data } = useRoomInfo();
  const sessionId = data?.channel;

  // 🔥 CONFIGURABLE: Change this to adjust interval
  const PROCESSING_INTERVAL_MS = 60000; // 60000 = 1 min, 300000 = 5 min



  const [snapshots, setSnapshots] = useState<EmotionSnapshot[]>([]);
  const [sessionCreatedAt, setSessionCreatedAt] = useState<Date | null>(null);
  const lastProcessedMinute = useRef<number>(-1);
  const processingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('🔍 Session listener effect triggered, sessionId:', sessionId);
    if (!sessionId) return;

    const sessionRef = doc(db, 'sessions', sessionId);
    let timeoutId: NodeJS.Timeout;

    console.log('🔍 Setting up real-time listener for session...');
    
    const unsubscribe = onSnapshot(
      sessionRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const createdAt = snapshot.data().createdAt?.toDate();
          console.log('✅ Session createdAt received:', createdAt);
          setSessionCreatedAt(createdAt);
          clearTimeout(timeoutId);
        } else {
          console.log('⏳ Waiting for session to be created...');
        }
      },
      (error) => {
        console.error('❌ Error listening to session:', error);
      }
    );

    timeoutId = setTimeout(() => {
      if (!sessionCreatedAt) {
        console.error('❌ Session was never created after 30 seconds');
      }
    }, 30000);

    return () => {
      console.log('🛑 Cleaning up session listener');
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [sessionId]);

  useEffect(() => {
    console.log('🔍 Emotion listener effect triggered, sessionId:', sessionId, 'createdAt:', sessionCreatedAt);
    if (!sessionId || !sessionCreatedAt) return;

    console.log('✅ Starting emotion listener...');
    const attendeesRef = collection(db, `sessions/${sessionId}/attendees`);

    const unsubscribe = onSnapshot(attendeesRef, (snapshot) => {
      console.log('📊 Snapshot received, docs:', snapshot.docs.length);

      if (snapshot.docs.length === 0) {
        console.log('⏭️ No attendees yet, skipping processing');
        return;
      }

      const allEmotions: { emotion: string; timestamp: Date }[] = [];
      let participantCount = 0;

      snapshot.forEach(doc => {
        const attendeeData = doc.data();
        participantCount++;
        console.log('👤 Attendee emotions:', attendeeData.emotions?.length || 0);
        attendeeData.emotions?.forEach((emotion: any) => {
          const timestamp = emotion.timestamp?.toDate();
          if (timestamp) {
            allEmotions.push({ emotion: emotion.emotion.toLowerCase(), timestamp });
          }
        });
      });

      console.log('📊 Total emotions:', allEmotions.length, 'Participants:', participantCount);

      if (allEmotions.length > 0 && participantCount > 0) {
        console.log('🚀 Processing emotions after Firebase update');
        processEmotions(allEmotions, participantCount, sessionCreatedAt);
      } else {
        console.log('⏭️ No emotions to process yet');
      }
    });

    processingInterval.current = setInterval(() => {
      console.log('⏰ Fallback processing interval triggered');
    }, PROCESSING_INTERVAL_MS);

    return () => {
      console.log('🛑 Cleaning up emotion listener');
      unsubscribe();
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
      }
    };
  }, [sessionId, sessionCreatedAt, PROCESSING_INTERVAL_MS]);

  const processEmotions = (allEmotions: { emotion: string; timestamp: Date }[], participantCount: number, sessionStart: Date) => {
    console.log('🔄 processEmotions called, emotions:', allEmotions.length);

    if (allEmotions.length === 0) {
      console.log('⚠️ No emotions to process');
      return;
    }

    const now = new Date();
    const intervalMinutes = PROCESSING_INTERVAL_MS / 60000; 
    const currentInterval = Math.floor((now.getTime() - sessionStart.getTime()) / PROCESSING_INTERVAL_MS);

    console.log('⏱️ Current interval:', currentInterval, 'Last processed:', lastProcessedMinute.current);

    if (currentInterval <= lastProcessedMinute.current) {
      console.log('⏭️ Already processed this interval');
      return;
    }

    const newSnapshots: EmotionSnapshot[] = [];

    for (let i = lastProcessedMinute.current + 1; i <= currentInterval; i++) {
      const startTime = new Date(sessionStart.getTime() + i * PROCESSING_INTERVAL_MS);
      const endTime = new Date(sessionStart.getTime() + (i + 1) * PROCESSING_INTERVAL_MS);

      const intervalEmotions = allEmotions.filter(e =>
        e.timestamp >= startTime && e.timestamp < endTime
      );

      console.log(`📅 Interval ${i}: ${intervalEmotions.length} emotions`);

      let engagement: 'Positive' | 'Negative' | 'Neutral';
      let percentage: number;
      let summary: string;

      // 🔥 Handle intervals with no emotions
      if (intervalEmotions.length === 0) {
        console.log(`⏭️ No emotions in interval ${i}`);
        engagement = 'Neutral';
        percentage = 0;
        summary = "No emotion data recorded for this interval.";
      } else {
        const positive = intervalEmotions.filter(e => ['happiness', 'surprise'].includes(e.emotion)).length;
        const negative = intervalEmotions.filter(e => ['sadness', 'anger', 'disgust', 'fear'].includes(e.emotion)).length;
        const neutral = intervalEmotions.filter(e => e.emotion === 'neutral').length;
        const total = positive + negative + neutral;

        console.log(`😊 Positive: ${positive}, 😢 Negative: ${negative}, 😐 Neutral: ${neutral}`);

        if (positive > negative && positive > neutral) {
          engagement = 'Positive';
          percentage = (positive / total) * 100;
          summary = percentage > 60 ?
            "Great energy! Students are actively engaged." :
            "Good engagement, consider maintaining this momentum.";
        } else if (negative > positive && negative > neutral) {
          engagement = 'Negative';
          percentage = (negative / total) * 100;
          summary = percentage > 50 ?
            "Students seem frustrated. Try adding interactive elements." :
            "Some challenge detected. Check if pacing is appropriate.";
        } else {
          engagement = 'Neutral';
          percentage = (neutral / total) * 100;
          summary = percentage > 70 ?
            "Students appear focused but not animated. Add engagement activities." :
            "Steady attention. Students are processing information.";
        }
      }

      newSnapshots.push({
        timeRange: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        engagement,
        percentage: Math.round(percentage),
        participantCount,
        summary
      });
    }

    if (newSnapshots.length > 0) {
      console.log('✅ Adding', newSnapshots.length, 'new snapshots');
      setSnapshots(prev => [...prev, ...newSnapshots]);
      lastProcessedMinute.current = currentInterval;
    }
  };

  console.log('📊 Current snapshots count:', snapshots.length);

  return (
    <EmotionSnapshotContext.Provider value={snapshots}>
      {children}
    </EmotionSnapshotContext.Provider>
  );
};
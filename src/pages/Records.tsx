import React, { useState, useEffect } from 'react';
import { BsReverseLayoutSidebarReverse } from "react-icons/bs";
import {
  Users,
  Clock,
  BarChart3,
  Calendar,
  Smile,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Search
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { SidebarLayout } from './layout/SidebarLayout';
import RecordSkeleton from '../components/skeleton/RecordSkeleton';
import { MdChevronLeft, MdRefresh } from 'react-icons/md';
import emptyState from '../assets/emptyState.png'
import { truncate } from 'fs';
import { se } from 'rn-emoji-keyboard';

interface EmotionDetection {
  confidence: number;
  emotion: string;
  timestamp: any;
}

interface Attendee {
  userUID: string;
  username: string;
  createdAt: any;
  emotions: EmotionDetection[];
}

interface SessionData {
  sessionID: string;
  meetingTitle: string;
  createdAt: any;
  attendees: Attendee[];
  participantCount: number;
  emotionCount: number;
  duration: string;
}

const EMOTION_COLORS = {
  happiness: '#f5e60a',
  neutral: '#6b7280',
  sadness: '#0a90f5',
  anger: '#f50a1d',
  fear: '#f5940a',
  disgust: '#c60af5',
  surprise: '#0af5d2'
};

const EMOTION_EMOJIS = {
  happiness: '😊',
  neutral: '😐',
  sadness: '😢',
  anger: '😠',
  fear: '😨',
  disgust: '🤢',
  surprise: '😮'
};

const ENGAGEMENT_TIPS = [
  {
    title: "Understanding Neutral Expressions",
    content: "Neutral doesn't always mean disengaged. Students may appear neutral while deeply focused on problem-solving or critical thinking. Consider the context of your lesson."
  },
  {
    title: "Fear vs. Concentration",
    content: "Fear expressions can sometimes indicate intense concentration or cognitive challenge. If detected during complex topics, it might reflect mental effort rather than distress."
  },
  {
    title: "Surprise Indicates Engagement",
    content: "Surprise often signals moments of learning breakthroughs or unexpected discoveries. These are valuable indicators of engaged cognitive processing."
  },
  {
    title: "About False Positives",
    content: "The system detects facial muscle movements, which can be triggered by various factors. A yawn might register as surprise, or squinting at the screen as disgust. Always interpret data within context."
  },
  {
    title: "Happiness Isn't Always Positive",
    content: "While happiness often indicates enjoyment, it could also mean off-task socializing. Combine emotion data with other engagement metrics for full context."
  },
  {
    title: "Mixed Emotions Are Normal",
    content: "Students experiencing a variety of emotions during a session is healthy. Learning involves challenge (fear), discovery (surprise), and satisfaction (happiness)."
  },
  {
    title: "Technical Limitations",
    content: "Lighting conditions, camera angles, and individual facial expressions vary. The system provides trends, not definitive assessments of student wellbeing."
  },
  {
    title: "Cultural Considerations",
    content: "Facial expressions can vary across cultures. Students may express engagement differently. Use this data as one of many indicators, not the sole measure."
  },
  {
    title: "Group Mood Can Be Contagious",
    content: "One student’s reaction—like laughter or frustration—can influence others. This can shift the emotional tone of the whole group, even if the lesson hasn’t changed."
  },
  {
    title: "Long Sessions Can Flatten Expressions",
    content: "After a while, students may stop showing much on their faces—not because they’re bored, but because they’re tired. Keep this in mind during longer lessons."
  },
  {
    title: "FER Doesn’t Know the Whole Story",
    content: "Facial Emotion Recognition (FER) tools only see what’s on the surface. They don’t know if a student is tired, distracted by something off-screen, or just thinking deeply."
  },
  {
    title: "Facial Data Isn't Emotion Proof",
    content: "Just because a face looks a certain way doesn’t mean the student feels that way. Expressions can be misleading, so always check against what’s happening in the lesson."
  },
  {
    title: "Students May Mask Emotions",
    content: "Some students naturally keep a calm or blank face, even when they’re excited or confused. Don’t assume lack of expression means lack of interest."
  },
  {
    title: "Short Expressions Can Be Missed",
    content: "Quick flashes of emotion—like a brief smile or frown—might not be picked up by the system. These moments matter, but they’re easy to miss."
  },
  {
    title: "About False Positives 2",
    content: "Speaking while emotion tracking is active can trigger false readings. Movements like raised eyebrows, wide eyes, or stretched lips during speech might be misread as surprise, fear, or happiness. Always consider whether the student was talking when interpreting emotion data."
  },
  {
    title: "Monday vs. Friday Energy",
    content: "Students often show different emotions depending on the day of the week. Monday sessions might be quieter, while Friday classes could be more energetic or distracted. This is normal classroom rhythm."
  },
  {
    title: "Weather Can Affect Mood",
    content: "Rainy or gloomy days often result in more neutral or subdued expressions. Sunny days might bring more happiness and energy. Consider external factors beyond your control when reviewing session data."
  },
  {
    title: "Post-Lunch Dip Is Real",
    content: "Sessions right after lunch often show more neutral faces and less animation. Students are digesting food and naturally more relaxed. This afternoon slump is normal and not a sign of poor engagement."
  },
  {
    title: "First Session vs. Last Session",
    content: "Compare your first class of the day to your last. Earlier sessions might show fresher faces, while later ones display fatigue. Adjust expectations and teaching energy accordingly throughout the day."
  },
  {
    title: "Review Sessions Look Different",
    content: "When reviewing material students already know, you'll likely see more neutral expressions. This doesn't mean they're bored—they're just processing familiar information with less surprise or confusion."
  },
  {
    title: "Introduction Sessions Are Mixed",
    content: "First lessons on new topics often show a mix of curiosity (surprise), uncertainty (fear), and focus (neutral). This variety is healthy and shows students are actively processing new information."
  },
  {
    title: "Group Work Changes Everything",
    content: "When students work together in pairs or groups, emotion patterns shift dramatically. You'll often see more happiness and surprise as they interact with peers, which is a positive sign of collaboration."
  },
  {
    title: "Exam Week Looks Grim",
    content: "During exam periods, don't expect cheerful expressions. Fear and neutral faces dominate, even if students are well-prepared. This is test stress, not a reflection of your teaching quality."
  },
  {
    title: "Holiday Sessions Are Chaotic",
    content: "Sessions before or after holidays show unusual emotion patterns. Students are excited, distracted, or tired from travel. Don't compare these sessions to regular ones—they're outliers."
  },
  {
    title: "Video-Heavy Lessons Vary",
    content: "When showing videos or presentations, students' faces often go neutral as they watch screens. This is normal—they're absorbing visual content, not disengaged. Look for reactions after the video ends."
  },
  {
    title: "Silent Work Time Is Neutral",
    content: "Independent work periods, like completing worksheets or coding exercises, naturally produce neutral expressions. Students are concentrating on their own tasks. This isn't a bad thing—it's focused work mode."
  },
  {
    title: "Repeating Material Feels Flat",
    content: "When you have to re-explain concepts from previous sessions, emotion data might look less engaged. Students who already understand won't show surprise, while those catching up are focused (neutral)."
  },
  {
    title: "Guest Speakers Change Moods",
    content: "When someone else presents, emotion patterns will differ from your usual sessions. Students might show more curiosity or politeness. Compare these special sessions separately from your regular teaching data."
  },
  {
    title: "End of Semester Exhaustion",
    content: "Toward the end of a term, expect more fatigue and fewer animated expressions overall. Students are mentally drained from weeks of learning. Lower energy is normal—they're running on empty, not uninterested."
  },
];

const SESSIONS_CACHE_KEY = 'emotion_analytics_sessions_cache';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

const CustomTooltip = ({ active = false, payload = [] } = {}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#1d1d1d] border border-[#2d2d2d] p-3 rounded-lg shadow-xl">
      <p className="text-sm font-medium text-white mb-2">{payload[0].payload.time}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs" style={{ color: entry.color }}>
          {EMOTION_EMOJIS[entry.name] || ''} {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active = false, payload = [] } = {}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#1d1d1d] border border-[#2d2d2d] p-3 rounded-lg shadow-xl">
      <p className="text-sm font-medium text-white">
        {EMOTION_EMOJIS[payload[0].name] || ''} {payload[0].name}
      </p>
      <p className="text-xs text-gray-400">
        {payload[0].value} detections ({payload[0].payload.percent}%)
      </p>
    </div>
  );
};

const StatCard = ({ icon, label, value, sublabel = '' }) => (
  <div className='bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-5 min-h-[120px] flex flex-col justify-between'>
    <div className='flex items-center gap-2 text-gray-400'>
      {icon}
      <span className='text-xs sm:text-sm truncate max-w-max'>{label}</span>
    </div>
    <div>
      <p className='text-2xl sm:text-3xl font-bold mt-2'>{value}</p>
      {sublabel && <p className='text-xs text-gray-500 mt-1 truncate max-w-max' title={sublabel}>{sublabel}</p>}
    </div>
  </div>
);

const Records: React.FC & {
  layout?: (page: React.ReactNode) => JSX.Element;
} = () => {
  const SidebarIcon = BsReverseLayoutSidebarReverse as React.ComponentType<{ className?: string; onClick?: () => void }>;
  const ReturnIcon = MdChevronLeft as React.ComponentType<{ className?: string; onClick?: () => void }>;
  const RefreshIcon = MdRefresh as React.ComponentType<{ className?: string; onClick?: () => void }>;
  const [hoveringEmotion, setHoveringEmotion] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [tipIntervalId, setTipIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add this useEffect for debouncing (place it with your other useEffects)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Add this filtered sessions logic before your return statement
  const filteredSessions = sessions.filter(session => {
    if (!debouncedQuery.trim()) return true;

    const query = debouncedQuery.toLowerCase();
    const titleMatch = session.meetingTitle.toLowerCase().includes(query);

    // Search by date in various formats
    const sessionDate = session.createdAt?.toDate ? session.createdAt.toDate() : new Date(session.createdAt);
    const dateStr = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase();
    const isoDate = sessionDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const dateMatch = dateStr.includes(query) || isoDate.includes(query);

    return titleMatch || dateMatch;
  });

  // Then in your sidebar JSX, replace the existing content with:

  const startTipInterval = () => {
    // Clear existing interval if any
    if (tipIntervalId) {
      clearInterval(tipIntervalId);
    }

    // Start new interval
    const newInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % ENGAGEMENT_TIPS.length);
    }, 10000); // Change tip every 10 seconds

    setTipIntervalId(newInterval);
  };

  const handleTipClick = (index: number) => {
    setCurrentTipIndex(index);
    startTipInterval(); // Reset the interval
  };

  useEffect(() => {
    startTipInterval();

    return () => {
      if (tipIntervalId) {
        clearInterval(tipIntervalId);
      }
    };
  }, []);

  useEffect(() => {
    const fetchSessions = async (forceRefresh = false) => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        // Try to load from cache first
        if (!forceRefresh) {
          const cached = localStorage.getItem(SESSIONS_CACHE_KEY);
          if (cached) {
            try {
              const { data, timestamp, userId } = JSON.parse(cached);
              const now = Date.now();

              // Check if cache is valid (same user and not expired)
              if (userId === currentUser.uid && (now - timestamp) < CACHE_EXPIRY_MS) {
                console.log('Loading from cache');
                // Convert stored dates back to proper format
                const restoredSessions = data.map((session: any) => ({
                  ...session,
                  createdAt: { toDate: () => new Date(session.createdAt) },
                  attendees: session.attendees.map((attendee: any) => ({
                    ...attendee,
                    createdAt: attendee.createdAt ? { toDate: () => new Date(attendee.createdAt) } : null,
                    emotions: attendee.emotions.map((emotion: any) => ({
                      ...emotion,
                      timestamp: emotion.timestamp ? { toDate: () => new Date(emotion.timestamp) } : null
                    }))
                  }))
                }));
                setSessions(restoredSessions);
                setLoading(false);
                return;
              }
            } catch (e) {
              console.error('Cache parse error:', e);
            }
          }
        }

        console.log('Fetching from Firestore');
        const sessionsRef = collection(db, 'sessions');
        const sessionsQuery = query(sessionsRef, where('hostUIDs', 'array-contains', currentUser.uid));
        const sessionsSnap = await getDocs(sessionsQuery);
        const hostedSessions: SessionData[] = [];

        for (const sessionDoc of sessionsSnap.docs) {
          const sessionData = sessionDoc.data();
          const sessionId = sessionDoc.id;

          const attendeesRef = collection(db, `sessions/${sessionId}/attendees`);
          const attendeesSnap = await getDocs(attendeesRef);

          // Skip sessions with no attendees
          if (attendeesSnap.empty) continue;

          const attendees: Attendee[] = [];
          let totalEmotions = 0;
          let firstTimestamp: Date | null = null;
          let lastTimestamp: Date | null = null;

          attendeesSnap.forEach(attendeeDoc => {
            const attendeeData = attendeeDoc.data();
            const emotions = attendeeData.emotions || [];

            attendees.push({
              userUID: attendeeData.userUID,
              username: attendeeData.username,
              createdAt: attendeeData.createdAt,
              emotions: emotions
            });

            totalEmotions += emotions.length;

            emotions.forEach((emotion: EmotionDetection) => {
              const timestamp = emotion.timestamp?.toDate ? emotion.timestamp.toDate() : new Date(emotion.timestamp);
              if (!firstTimestamp || timestamp < firstTimestamp) {
                firstTimestamp = timestamp;
              }
              if (!lastTimestamp || timestamp > lastTimestamp) {
                lastTimestamp = timestamp;
              }
            });
          });

          let duration = '0 min';
          const sessionCreated = sessionData.createdAt?.toDate ? sessionData.createdAt.toDate() : new Date(sessionData.createdAt);
          if (firstTimestamp && lastTimestamp) {
            const durationMs = lastTimestamp.getTime() - sessionCreated.getTime();
            const durationMin = Math.round(durationMs / 60000);
            duration = `${durationMin} min`;
          }

          hostedSessions.push({
            sessionID: sessionId,
            meetingTitle: sessionData.meetingTitle || 'Untitled Session',
            createdAt: sessionData.createdAt,
            attendees,
            participantCount: attendees.length,
            emotionCount: totalEmotions,
            duration
          });
        }

        hostedSessions.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        // Save to cache - convert Firestore Timestamps to ISO strings
        try {
          const cacheData = hostedSessions.map(session => ({
            ...session,
            createdAt: session.createdAt?.toDate ? session.createdAt.toDate().toISOString() : new Date(session.createdAt).toISOString(),
            attendees: session.attendees.map(attendee => ({
              ...attendee,
              createdAt: attendee.createdAt?.toDate ? attendee.createdAt.toDate().toISOString() : (attendee.createdAt ? new Date(attendee.createdAt).toISOString() : null),
              emotions: attendee.emotions.map(emotion => ({
                ...emotion,
                timestamp: emotion.timestamp?.toDate ? emotion.timestamp.toDate().toISOString() : (emotion.timestamp ? new Date(emotion.timestamp).toISOString() : null)
              }))
            }))
          }));

          localStorage.setItem(SESSIONS_CACHE_KEY, JSON.stringify({
            data: cacheData,
            timestamp: Date.now(),
            userId: currentUser.uid
          }));
        } catch (e) {
          console.error('Failed to cache sessions:', e);
        }

        setSessions(hostedSessions);
        setLoading(false);
        setIsRefreshing(false);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setError('Failed to load sessions. Please refresh the page.');
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchSessions();

    // Expose refresh function
    (window as any).refreshSessions = () => {
      setIsRefreshing(true);
      fetchSessions(true);
    };
  }, []);

  const calculateOverallStats = () => {
    const totalSessions = sessions.length;
    const totalParticipants = sessions.reduce((sum, session) => sum + session.participantCount, 0);
    const totalEmotionSamples = sessions.reduce((sum, session) => sum + session.emotionCount, 0);

    let totalMinutes = 0;
    sessions.forEach(session => {
      const minutes = parseInt(session.duration);
      if (!isNaN(minutes)) totalMinutes += minutes;
    });
    const avgDuration = totalSessions > 0 ? `${Math.round(totalMinutes / totalSessions)} min` : '0 min';

    return { totalSessions, totalParticipants, avgDuration, totalEmotionSamples };
  };

  const aggregateAllEmotions = () => {
    const emotionCounts: { [key: string]: number } = {};

    sessions.forEach(session => {
      session.attendees.forEach(attendee => {
        attendee.emotions.forEach(emotion => {
          const emotionName = emotion.emotion.toLowerCase();
          emotionCounts[emotionName] = (emotionCounts[emotionName] || 0) + 1;
        });
      });
    });

    const total = Object.values(emotionCounts).reduce((sum: number, count: number) => sum + count, 0);

    return Object.entries(emotionCounts)
      .map(([name, value]) => ({
        name,
        value,
        percent: total > 0 ? parseFloat(((value / total) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.value - a.value);
  };

  const calculateEngagement = (emotionData: any[]) => {
    const positive = emotionData.filter(e => ['happiness', 'surprise'].includes(e.name)).reduce((sum, e) => sum + e.value, 0);
    const negative = emotionData.filter(e => ['sadness', 'anger', 'disgust', 'fear'].includes(e.name)).reduce((sum, e) => sum + e.value, 0);
    const neutral = emotionData.filter(e => e.name === 'neutral').reduce((sum, e) => sum + e.value, 0);
    const total = positive + negative + neutral;

    return [
      { name: 'Positive', value: positive, percent: total > 0 ? parseFloat(((positive / total) * 100).toFixed(1)) : 0, color: '#10b981' },
      { name: 'Neutral', value: neutral, percent: total > 0 ? parseFloat(((neutral / total) * 100).toFixed(1)) : 0, color: '#6b7280' },
      { name: 'Negative', value: negative, percent: total > 0 ? parseFloat(((negative / total) * 100).toFixed(1)) : 0, color: '#ef4444' }
    ];
  };

  const generateRecommendations = (emotionData: any[]) => {
    const engagement = calculateEngagement(emotionData);
    const positivePercent = engagement.find(e => e.name === 'Positive')?.percent || 0;
    const negativePercent = engagement.find(e => e.name === 'Negative')?.percent || 0;
    const neutralPercent = engagement.find(e => e.name === 'Neutral')?.percent || 0;

    const recommendations = [];

    // Calculate differences between pairs
    const posNegDiff = Math.abs(positivePercent - negativePercent);
    const posNeuDiff = Math.abs(positivePercent - neutralPercent);
    const negNeuDiff = Math.abs(negativePercent - neutralPercent);

    // Determine the dominant emotion group
    const max = Math.max(positivePercent, negativePercent, neutralPercent);
    const min = Math.min(positivePercent, negativePercent, neutralPercent);

    // TRULY BALANCED (all three within ~15% of each other)
    if (max - min < 15) {
      recommendations.push({
        type: 'success',
        title: 'Balanced Emotional Climate',
        message: `Emotions are evenly distributed (Positive: ${positivePercent.toFixed(0)}%, Neutral: ${neutralPercent.toFixed(0)}%, Negative: ${negativePercent.toFixed(0)}%). This suggests varied student responses—some engaged, some focused, some challenged. This diversity is normal in active learning environments.`
      });
    }

    // TWO-WAY BALANCED: Positive & Negative (Neutral is low)
    else if (posNegDiff < 15 && neutralPercent < Math.min(positivePercent, negativePercent) - 10) {
      recommendations.push({
        type: 'warning',
        title: 'Polarized Student Responses',
        message: `Students show split reactions with ${positivePercent.toFixed(0)}% positive and ${negativePercent.toFixed(0)}% negative, while neutral is low (${neutralPercent.toFixed(0)}%). Some students are thriving while others struggle. Consider differentiated support or checking if content difficulty varies across the group.`
      });
    }

    // TWO-WAY BALANCED: Positive & Neutral (Negative is low)
    else if (posNeuDiff < 15 && negativePercent < Math.min(positivePercent, neutralPercent) - 10) {
      recommendations.push({
        type: 'success',
        title: 'Positive and Focused Atmosphere',
        message: `Strong balance between positive (${positivePercent.toFixed(0)}%) and neutral (${neutralPercent.toFixed(0)}%) with minimal negative affect (${negativePercent.toFixed(0)}%). Students appear engaged and focused without signs of distress. This is an ideal learning state.`
      });
    }

    // TWO-WAY BALANCED: Negative & Neutral (Positive is low)
    else if (negNeuDiff < 15 && positivePercent < Math.min(negativePercent, neutralPercent) - 10) {
      recommendations.push({
        type: 'concern',
        title: 'Low Positive Engagement',
        message: `Emotions split between negative (${negativePercent.toFixed(0)}%) and neutral (${neutralPercent.toFixed(0)}%), with little positive affect (${positivePercent.toFixed(0)}%). Students may be disengaged or finding content challenging. Try incorporating interactive elements, check pacing, or add moments of success/achievement.`
      });
    }

    // CLEAR DOMINANT: Positive leads significantly
    else if (positivePercent === max && positivePercent > neutralPercent + 15 && positivePercent > negativePercent + 15) {
      recommendations.push({
        type: 'success',
        title: 'Highly Engaged Students',
        message: `${positivePercent.toFixed(0)}% positive affect indicates strong engagement. Students are responding well to the content. Note what worked here—teaching method, topic choice, or pacing—to replicate in future sessions.`
      });
    }

    // CLEAR DOMINANT: Neutral leads significantly
    else if (neutralPercent === max && neutralPercent > positivePercent + 15 && neutralPercent > negativePercent + 15) {
      recommendations.push({
        type: 'info',
        title: 'High Neutral Expressions',
        message: `${neutralPercent.toFixed(0)}% neutral affect could mean deep focus or passive disengagement. Consider adding interactive elements (polls, discussions, quick activities) to verify engagement levels and energize the session.`
      });
    }

    // CLEAR DOMINANT: Negative leads significantly
    else if (negativePercent === max && negativePercent > positivePercent + 15 && negativePercent > neutralPercent + 15) {
      recommendations.push({
        type: 'concern',
        title: 'Elevated Negative Affect',
        message: `${negativePercent.toFixed(0)}% negative emotions suggests students are struggling, frustrated, or anxious. Consider: Is the content too challenging? Are technical issues present? Would breaking into smaller segments help? Check in with students directly.`
      });
    }

    // MODERATE DOMINANT (leading but not by much - catch remaining cases)
    else if (positivePercent === max) {
      recommendations.push({
        type: 'success',
        title: 'Positive Engagement with Mixed Signals',
        message: `While positive emotions lead at ${positivePercent.toFixed(0)}%, there's notable ${neutralPercent > negativePercent ? 'neutral' : 'negative'} affect (${(neutralPercent > negativePercent ? neutralPercent : negativePercent).toFixed(0)}%). Students are generally engaged but some may need additional support or stimulation.`
      });
    }
    else if (neutralPercent === max) {
      recommendations.push({
        type: 'info',
        title: 'Neutral-Leaning with Mixed Responses',
        message: `Neutral expressions lead at ${neutralPercent.toFixed(0)}%, with ${positivePercent.toFixed(0)}% positive and ${negativePercent.toFixed(0)}% negative. Students appear attentive but not highly animated. This is normal for lecture-heavy or independent work periods.`
      });
    }
    else if (negativePercent === max) {
      recommendations.push({
        type: 'warning',
        title: 'Negative Trend in Student Affect',
        message: `Negative affect at ${negativePercent.toFixed(0)}% is higher than positive (${positivePercent.toFixed(0)}%). This may indicate challenging material or test stress. Provide encouragement and ensure students have support resources available.`
      });
    }

    return recommendations;
  };

  const aggregateSessionEmotions = (sessionId: string | null) => {
    if (!sessionId) return [];
    const session = sessions.find(s => s.sessionID === sessionId);
    if (!session) return [];

    const emotionCounts: { [key: string]: number } = {};
    session.attendees.forEach(attendee => {
      attendee.emotions.forEach(emotion => {
        const emotionName = emotion.emotion.toLowerCase();
        emotionCounts[emotionName] = (emotionCounts[emotionName] || 0) + 1;
      });
    });

    const total = Object.values(emotionCounts).reduce((sum: number, count: number) => sum + count, 0);

    return Object.entries(emotionCounts)
      .map(([name, value]) => ({
        name,
        value,
        percent: total > 0 ? parseFloat(((value / total) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.value - a.value);
  };

  const createTimelineData = (sessionId: string | null) => {
    if (!sessionId) return [];
    const session = sessions.find(s => s.sessionID === sessionId);
    if (!session) return [];

    if (!session.attendees || session.attendees.length === 0) return [];

    const sessionCreatedTime = session.createdAt?.toDate ? session.createdAt.toDate() : new Date(session.createdAt);

    const allEmotions: { emotion: string; timestamp: Date }[] = [];
    session.attendees.forEach(attendee => {
      if (!attendee.emotions || attendee.emotions.length === 0) return;

      attendee.emotions.forEach(emotion => {
        if (!emotion.timestamp) return;

        const timestamp = emotion.timestamp?.toDate ? emotion.timestamp.toDate() : new Date(emotion.timestamp);
        allEmotions.push({ emotion: emotion.emotion.toLowerCase(), timestamp });
      });
    });

    if (allEmotions.length === 0) return [];

    allEmotions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const lastTime = allEmotions[allEmotions.length - 1].timestamp;
    const totalDuration = lastTime.getTime() - sessionCreatedTime.getTime();
    const durationMinutes = Math.ceil(totalDuration / 60000);
    const binCount = Math.max(1, Math.ceil(durationMinutes / 5));

    const bins: any[] = [];

    for (let i = 0; i < binCount; i++) {
      const binStart = i * 5;
      const binEnd = (i + 1) * 5;
      const binLabel = `${binStart}-${binEnd}m`;

      const binData: any = { time: binLabel };
      Object.keys(EMOTION_COLORS).forEach(emotionName => {
        binData[emotionName] = 0;
      });

      allEmotions.forEach(({ emotion, timestamp }) => {
        const minutesSinceStart = (timestamp.getTime() - sessionCreatedTime.getTime()) / 60000;
        if (minutesSinceStart >= binStart && minutesSinceStart < binEnd) {
          binData[emotion] = (binData[emotion] || 0) + 1;
        }
      });

      bins.push(binData);
    }

    return bins;
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <RecordSkeleton />
    )
  }

  if (error) {
    return (
      <div className='h-full w-full flex items-center justify-center text-white bg-[#1c1c1b]'>
        <div className='text-center'>
          <p className='text-red-400'>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className='h-full w-full flex items-center justify-center text-white bg-[#1c1c1b]'>
        <div className='flex flex-col justify-center space-y-3'>
          <img
            src={emptyState}
            alt='Image'
            width={300}
            height={300}
            className='w-40 h-auto rounded-md opacity-70'
          />
          <p className='text-gray-400'>No hosted sessions yet</p>
        </div>
      </div>
    );
  }

  const overallStats = calculateOverallStats();
  const overallEmotionData = aggregateAllEmotions();
  const overallEngagement = calculateEngagement(overallEmotionData);
  const overallRecommendations = generateRecommendations(overallEmotionData);
  const selectedSession = sessions.find(s => s.sessionID === selectedSessionId);
  const sessionEmotionData = aggregateSessionEmotions(selectedSessionId);
  const sessionEngagement = selectedSession ? calculateEngagement(sessionEmotionData) : [];
  const sessionRecommendations = selectedSession ? generateRecommendations(sessionEmotionData) : [];
  const timelineData = createTimelineData(selectedSessionId);
  const currentTip = ENGAGEMENT_TIPS[currentTipIndex];

  return (
    <div className='h-full w-full flex text-white relative overflow-hidden bg-[#1c1c1b]'>
      {isOpen && (
        <div
          className={`sm:hidden absolute inset-0 bg-black transition-opacity duration-300 z-10 ${isOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div className='h-full flex flex-col flex-1 p-3 sm:p-6 gap-4 sm:gap-6 overflow-auto relative z-0'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <h1 className={`text-xl sm:text-2xl font-bold ${selectedSession ? 'truncate max-w-sm lg:max-w-md' : ''}`}
              title={selectedSession ? selectedSession.meetingTitle : ''}
            >
              {selectedSession ? selectedSession.meetingTitle : 'Emotion Analytics'}
            </h1>
            <div className='flex items-center mr-10'>
              {selectedSession && (
                <button onClick={() => setSelectedSessionId(null)} className='flex items-center text-sm text-gray-400 hover:text-white transition'>
                  <ReturnIcon className='w-4 h-4 mt-0.5' />
                  <span className='leading-none whitespace-nowrap'>Back to Overview</span>
                </button>
              )}
              {!selectedSession && (
                <button
                  onClick={() => (window as any).refreshSessions()}
                  disabled={isRefreshing}
                  className='text-sm text-gray-400 hover:text-white transition disabled:opacity-50 flex items-center gap-1'
                >
                  {isRefreshing ? (
                    <>
                      <div className='w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin'></div>
                      Refreshing...
                    </>
                  ) : (
                    <div className='flex items-center'>
                      <RefreshIcon className='w-4 h-4 mt-[1px]' />
                      <span className='leading-none'>Refresh</span>
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
          <p className='text-gray-400 text-sm sm:text-base'>
            {selectedSession
              ? `Session from ${formatDate(selectedSession.createdAt)} • ${selectedSession.participantCount} participants`
              : 'View emotion data from your sessions'}
          </p>
        </div>

        {!selectedSession ? (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
              <StatCard icon={<Calendar className='w-5 h-5' />} label="Total Sessions" value={overallStats.totalSessions} />
              <StatCard icon={<Users className='w-5 h-5' />} label="Total Participants" sublabel='/w detected emotions' value={overallStats.totalParticipants} />
              <StatCard icon={<Clock className='w-5 h-5' />} label="Avg Session Duration" value={overallStats.avgDuration} />
              <StatCard icon={<BarChart3 className='w-5 h-5' />} label="Total Emotion Records" sublabel='per student emotion change' value={overallStats.totalEmotionSamples} />
            </div>

            {/* Tip Box */}
            <div className='w-full bg-gradient-to-r from-[#1a7368]/10 to-[#731a25]/10 border border-[#1a7368]/30 rounded-xl p-4 sm:p-5'>
              <div className='flex items-start gap-3'>
                <Lightbulb className='w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5' />
                <div className='flex-1'>
                  <h3 className='font-semibold text-sm sm:text-base mb-1'>{currentTip.title}</h3>
                  <p className='text-xs sm:text-sm text-gray-300 leading-relaxed'>{currentTip.content}</p>
                </div>
              </div>
              <div className='flex gap-1 mt-3'>
                {ENGAGEMENT_TIPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleTipClick(index)}
                    className={`h-1 rounded-full flex-1 transition-all cursor-pointer ${index === currentTipIndex ? 'bg-[#1a7368]' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    aria-label={`View tip ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 flex-1'>
              <div className='md:col-span-2 bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[300px]'>
                <div>
                  <h3 className='text-lg font-semibold'>Overall Emotion Distribution</h3>
                  <p className='text-xs text-gray-400 mt-1 mb-4'>Across all sessions</p>
                </div>
                {overallEmotionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={overallEmotionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        label={(entry) => `${entry.percent}%`}
                      >
                        {overallEmotionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name as keyof typeof EMOTION_COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend formatter={(value) => `${EMOTION_EMOJIS[value as keyof typeof EMOTION_EMOJIS] || ''} ${value}`} wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='h-full flex items-center justify-center text-gray-500'>No emotion data available</div>
                )}
              </div>

              <div className='bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[300px]'>
                <h3 className='text-lg font-semibold mb-2'>Engagement Assessment</h3>
                <p className='text-xs text-gray-400 mb-4'>Grouped emotion indicators</p>
                <div className='space-y-4 text-sm'>
                  {overallEngagement.map(item => (
                    <div key={item.name}>
                      <div className='flex justify-between mb-2'>
                        <span>{item.name}</span>
                        <span className='text-gray-400'>{item.percent}%</span>
                      </div>
                      <div className='w-full bg-[#2d2d2d] rounded-full h-2'>
                        <div className='h-2 rounded-full transition-all' style={{ width: `${item.percent}%`, backgroundColor: item.color }}></div>
                      </div>
                    </div>
                  ))}
                  <div className='mt-4 pt-4 border-t border-[#2d2d2d]'>
                    <p className='text-xs text-gray-500 leading-relaxed'>
                      <span className='text-green-400'>Positive:</span> Happiness, Surprise<br />
                      <span className='text-gray-400'>Neutral:</span> Neutral expressions<br />
                      <span className='text-red-400'>Negative:</span> Sadness, Anger, Disgust, Fear
                    </p>
                  </div>
                </div>
              </div>

              <div className='lg:col-span-3 bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[300px]'>
                <h3 className='text-lg font-semibold mb-4'>Recent Sessions</h3>
                <div className='space-y-2'>
                  {sessions.slice(0, 5).map(session => (
                    <div
                      key={session.sessionID}
                      onClick={() => setSelectedSessionId(session.sessionID)}
                      className='p-3 bg-[#2d2d2d] rounded-lg hover:bg-[#3d3d3d] cursor-pointer transition flex justify-between items-center'
                    >
                      <div className='w-8/10'>
                        <p className='font-medium truncate max-w-max' title={session.meetingTitle}>{session.meetingTitle}</p>
                        <p className='text-xs text-gray-400'>{formatDate(session.createdAt)} • {session.participantCount} participants</p>
                      </div>
                      <div className='text-sm text-gray-400'>{session.duration}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations Section */}
              <div className='col-span-full bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[200px]'>
                <div className='flex items-center gap-2 mb-4'>
                  <TrendingUp className='w-5 h-5 text-blue-400' />
                  <h3 className='text-lg font-semibold'>Recommendations</h3>
                </div>
                <div className='space-y-3'>
                  {overallRecommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${rec.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                      rec.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                        rec.type === 'concern' ? 'bg-red-500/10 border-red-500/30' :
                          'bg-blue-500/10 border-blue-500/30'
                      }`}>
                      <h4 className='font-semibold text-sm mb-2'>{rec.title}</h4>
                      <p className='text-xs text-gray-300 leading-relaxed'>{rec.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
              <StatCard
                icon={<Users className='w-5 h-5' />}
                label="Participants" value={selectedSession.participantCount}
                sublabel='/w detected emotions' />
              <StatCard icon={<Clock className='w-5 h-5' />} label="Duration" value={selectedSession.duration} />
              <StatCard icon={<BarChart3 className='w-5 h-5' />} label="Emotion Records" value={selectedSession.emotionCount} />
              <StatCard
                icon={<Smile className='w-5 h-5' />}
                label="Most Frequent"
                value={sessionEmotionData.length > 0 ? `${EMOTION_EMOJIS[sessionEmotionData[0].name as keyof typeof EMOTION_EMOJIS]} ${sessionEmotionData[0].name}` : 'N/A'}
                sublabel={sessionEmotionData.length > 0 ? `${sessionEmotionData[0].percent}%` : ''}
              />
            </div>

            {/* Session Tip Box */}
            <div className='w-full bg-gradient-to-r from-[#1a7368]/10 to-[#731a25]/10 border border-[#1a7368]/30 rounded-xl p-4 sm:p-5'>
              <div className='flex items-start gap-3'>
                <AlertCircle className='w-5 h-5 text-[#1a7368] flex-shrink-0 mt-0.5' />
                <div className='flex-1'>
                  <h3 className='font-semibold text-sm sm:text-base mb-1'>Session Context</h3>
                  <p className='text-xs sm:text-sm text-gray-300 leading-relaxed'>
                    This data represents facial expression patterns during the session. Remember that context matters—
                    {sessionEngagement.find(e => e.name === 'Neutral')?.percent > 50
                      ? " high neutral expressions may indicate focused concentration rather than disengagement."
                      : sessionEngagement.find(e => e.name === 'Negative')?.percent > 30
                        ? " elevated negative indicators could reflect challenging content or technical difficulties."
                        : " the emotion patterns suggest active engagement with varied responses."}
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 flex-1'>
              <div className='lg:col-span-4 bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[300px]'>
                <div>
                  <h3 className='text-lg font-semibold'>Emotion Timeline</h3>
                  <p className='text-xs text-gray-400 mt-1 mb-4'>Distribution across 5-minute intervals</p>
                </div>
                {timelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                      <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                        onMouseEnter={(e) => setHoveringEmotion(String(e.dataKey))}
                        onMouseLeave={() => setHoveringEmotion(null)}
                      />
                      <Area
                        type="monotone"
                        dataKey="happiness"
                        stackId="1"
                        stroke={EMOTION_COLORS.happiness}
                        fill={EMOTION_COLORS.happiness}
                        strokeOpacity={!hoveringEmotion || hoveringEmotion === 'happiness' ? 1 : 0.3}
                        fillOpacity={!hoveringEmotion || hoveringEmotion === 'happiness' ? 0.8 : 0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="neutral"
                        stackId="1"
                        stroke={EMOTION_COLORS.neutral}
                        fill={EMOTION_COLORS.neutral}
                        strokeOpacity={!hoveringEmotion || hoveringEmotion === 'neutral' ? 1 : 0.3}
                        fillOpacity={!hoveringEmotion || hoveringEmotion === 'neutral' ? 0.8 : 0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="fear"
                        stackId="1"
                        stroke={EMOTION_COLORS.fear}
                        fill={EMOTION_COLORS.fear}
                        strokeOpacity={!hoveringEmotion || hoveringEmotion === 'fear' ? 1 : 0.3}
                        fillOpacity={!hoveringEmotion || hoveringEmotion === 'fear' ? 0.8 : 0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="surprise"
                        stackId="1"
                        stroke={EMOTION_COLORS.surprise}
                        fill={EMOTION_COLORS.surprise}
                        strokeOpacity={!hoveringEmotion || hoveringEmotion === 'surprise' ? 1 : 0.3}
                        fillOpacity={!hoveringEmotion || hoveringEmotion === 'surprise' ? 0.8 : 0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="sadness"
                        stackId="1"
                        stroke={EMOTION_COLORS.sadness}
                        fill={EMOTION_COLORS.sadness}
                        strokeOpacity={!hoveringEmotion || hoveringEmotion === 'sadness' ? 1 : 0.3}
                        fillOpacity={!hoveringEmotion || hoveringEmotion === 'sadness' ? 0.8 : 0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="anger"
                        stackId="1"
                        stroke={EMOTION_COLORS.anger}
                        fill={EMOTION_COLORS.anger}
                        strokeOpacity={!hoveringEmotion || hoveringEmotion === 'anger' ? 1 : 0.3}
                        fillOpacity={!hoveringEmotion || hoveringEmotion === 'anger' ? 0.8 : 0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="disgust"
                        stackId="1"
                        stroke={EMOTION_COLORS.disgust}
                        fill={EMOTION_COLORS.disgust}
                        strokeOpacity={!hoveringEmotion || hoveringEmotion === 'disgust' ? 1 : 0.3}
                        fillOpacity={!hoveringEmotion || hoveringEmotion === 'disgust' ? 0.8 : 0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='h-full flex items-center justify-center text-gray-500'>No timeline data available</div>
                )}
              </div>

              {/* Session Engagement Assessment */}
              <div className='lg:col-span-2 bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[250px]'>
                <h3 className='text-sm font-semibold mb-2'>Session Engagement</h3>
                <p className='text-xs text-gray-400 mb-4'>Grouped emotion analysis</p>
                <div className='space-y-3 text-sm'>
                  {sessionEngagement.map(item => (
                    <div key={item.name}>
                      <div className='flex justify-between mb-2'>
                        <span>{item.name}</span>
                        <span className='text-gray-400'>{item.percent}%</span>
                      </div>
                      <div className='w-full bg-[#2d2d2d] rounded-full h-2'>
                        <div className='h-2 rounded-full transition-all' style={{ width: `${item.percent}%`, backgroundColor: item.color }}></div>
                      </div>
                    </div>
                  ))}
                  <div className='mt-4 pt-4 border-t border-[#2d2d2d]'>
                    <p className='text-xs text-gray-500 leading-relaxed'>
                      <span className='text-green-400'>Positive:</span> Happiness, Surprise<br />
                      <span className='text-gray-400'>Neutral:</span> Neutral expressions<br />
                      <span className='text-red-400'>Negative:</span> Sadness, Anger, Disgust, Fear
                    </p>
                  </div>
                </div>
              </div>

              <div className='lg:col-span-2 bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[250px]'>
                <h3 className='text-lg font-semibold mb-2'>Session Distribution</h3>
                <p className='text-xs text-gray-400 mb-4'>All detected emotions</p>
                <div className='space-y-2 text-sm'>
                  {sessionEmotionData.map(item => (
                    <div key={item.name}>
                      <div className='flex justify-between mb-1'>
                        <span className='capitalize'>{EMOTION_EMOJIS[item.name as keyof typeof EMOTION_EMOJIS]} {item.name}</span>
                        <span className='text-gray-400'>{item.value} ({item.percent}%)</span>
                      </div>
                      <div className='w-full bg-[#2d2d2d] rounded-full h-2'>
                        <div className='h-2 rounded-full' style={{ width: `${item.percent}%`, backgroundColor: EMOTION_COLORS[item.name as keyof typeof EMOTION_COLORS] }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Recommendations */}
              <div className='lg:col-span-4 bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[200px]'>
                <div className='flex items-center gap-2 mb-4'>
                  <TrendingUp className='w-5 h-5 text-blue-400' />
                  <h3 className='text-lg font-semibold'>Session Insights</h3>
                </div>
                <div className='space-y-3'>
                  {sessionRecommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${rec.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                      rec.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                        rec.type === 'concern' ? 'bg-red-500/10 border-red-500/30' :
                          'bg-blue-500/10 border-blue-500/30'
                      }`}>
                      <h4 className='font-semibold text-sm mb-2'>{rec.title}</h4>
                      <p className='text-xs text-gray-300 leading-relaxed'>{rec.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='lg:col-span-4 bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[200px]'>
                <h3 className='text-lg font-semibold mb-2'>Peak Moments</h3>
                <p className='text-xs text-gray-400 mb-4'>Highest recorded instances</p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 text-sm'>
                  {timelineData.length > 0 ? (
                    <>
                      {(() => {
                        const emotionPeaks = sessionEmotionData.slice(0, 3);
                        return emotionPeaks.map((emotionItem) => {
                          const peakBin = timelineData.reduce((max: any, item: any) => {
                            const currentCount = item[emotionItem.name] || 0;
                            const maxCount = max[emotionItem.name] || 0;
                            return currentCount > maxCount ? item : max;
                          }, timelineData[0]);

                          return (
                            <div key={emotionItem.name} className='p-3 bg-[#2d2d2d] rounded-lg'>
                              <p className='text-xs text-gray-500 mb-1 capitalize'>
                                {EMOTION_EMOJIS[emotionItem.name as keyof typeof EMOTION_EMOJIS]} {emotionItem.name}
                              </p>
                              <p className='font-medium'>{peakBin.time}</p>
                              <p className='text-xs text-gray-400 mt-1'>{peakBin[emotionItem.name] || 0} detections</p>
                            </div>
                          );
                        });
                      })()}
                      {sessionEmotionData.length < 3 && (
                        <>
                          {Array(3 - sessionEmotionData.length).fill(null).map((_, i) => (
                            <div key={`empty-${i}`} className='p-3 bg-[#2d2d2d] rounded-lg'>
                              <p className='text-xs text-gray-500 mb-1'>--</p>
                              <p className='font-medium'>--</p>
                              <p className='text-xs text-gray-400 mt-1'>N/A</p>
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    <div className='col-span-3 text-center text-gray-500'>No peak data available</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className='absolute sm:relative h-full right-0 top-0 z-20'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='absolute top-4 -left-10 z-30 p-2 bg-[#1d1d1d] border border-[#2d2d2d] rounded-lg text-gray-400 hover:text-white transition shadow-[0_4px_6px_rgba(0,0,0,0.3)]'
        >
          <SidebarIcon className='w-4 h-4' />
        </button>

        <div
          className={`h-full bg-[#1d1d1d] border-l border-[#2d2d2d] transition-all duration-300 ease-in-out ${isOpen ? 'w-60' : 'w-0'
            } overflow-hidden shadow-2xl sm:shadow-none`}
        >
          <div className='p-4 sm:p-6 h-full flex flex-col'>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Your Sessions</h3>

              {/* Search Bar */}
              <div className='mb-4 relative'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Search'
                    className='w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg pl-10 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1a7368] transition'
                  />
                </div>
                {searchQuery !== debouncedQuery && (
                  <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
                    <div className='w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin'></div>
                  </div>
                )}
              </div>
            </div>

            {/* Sessions List - Only this scrolls */}
            <div className='flex-1 overflow-y-auto space-y-2'>
              {filteredSessions.length > 0 ? (
                filteredSessions.map(session => (
                  <div
                    key={session.sessionID}
                    onClick={() => {
                      setSelectedSessionId(session.sessionID);
                      setIsOpen(false);
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition ${selectedSessionId === session.sessionID
                      ? 'bg-[#1a7368]/50'
                      : 'bg-[#2d2d2d] hover:bg-[#3d3d3d]'
                      }`}
                  >
                    <p className='font-medium text-sm truncate' title={session.meetingTitle}>{session.meetingTitle}</p>
                    <p className='text-xs text-gray-400 mt-1'>{formatDate(session.createdAt)}</p>
                    <div className='flex items-center justify-between mt-2 text-xs'>
                      <span className='text-gray-500'>{session.participantCount} participants</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-8'>
                  <p className='text-sm text-gray-500'>No sessions found</p>
                  <p className='text-xs text-gray-600 mt-1'>Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Records.layout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default Records;
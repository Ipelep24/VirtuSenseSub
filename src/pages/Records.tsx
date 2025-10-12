import React, { useState, useEffect } from 'react';
import { BsReverseLayoutSidebarReverse } from "react-icons/bs";
import {
  Users,
  Clock,
  BarChart3,
  Calendar,
  Smile
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
  ResponsiveContainer
} from 'recharts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { SidebarLayout } from './layout/SidebarLayout';

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
      <span className='text-xs sm:text-sm truncate max-w-[140px]'>{label}</span>
    </div>
    <div>
      <p className='text-2xl sm:text-3xl font-bold mt-2'>{value}</p>
      {sublabel && <p className='text-xs text-gray-500 mt-1'>{sublabel}</p>}
    </div>
  </div>
);

const Records: React.FC & {
    layout?: (page: React.ReactNode) => JSX.Element;
} = () => {
  const SidebarIcon = BsReverseLayoutSidebarReverse as React.ComponentType<{ className?: string; onClick?: () => void }>;
  const [isOpen, setIsOpen] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        const sessionsRef = collection(db, 'sessions');
        const sessionsSnap = await getDocs(sessionsRef);
        const hostedSessions: SessionData[] = [];

        for (const sessionDoc of sessionsSnap.docs) {
          const sessionData = sessionDoc.data();
          const sessionId = sessionDoc.id;

          const hostsRef = collection(db, `sessions/${sessionId}/hosts`);
          const hostQuery = query(hostsRef, where('userUID', '==', currentUser.uid));
          const hostSnap = await getDocs(hostQuery);

          if (hostSnap.empty) continue;

          const attendeesRef = collection(db, `sessions/${sessionId}/attendees`);
          const attendeesSnap = await getDocs(attendeesRef);

          const attendees: Attendee[] = [];
          let totalEmotions = 0;
          let firstTimestamp: Date | null = null;
          let lastTimestamp: Date | null = null;

          attendeesSnap.forEach(attendeeDoc => {
            const attendeeData = attendeeDoc.data();
            attendees.push({
              userUID: attendeeData.userUID,
              username: attendeeData.username,
              createdAt: attendeeData.createdAt,
              emotions: attendeeData.emotions || []
            });

            const emotions = attendeeData.emotions || [];
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
          if (firstTimestamp && lastTimestamp) {
            const durationMs = lastTimestamp.getTime() - firstTimestamp.getTime();
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

        setSessions(hostedSessions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setLoading(false);
      }
    };

    fetchSessions();
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
    const emotionCounts: {[key: string]: number} = {};

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

  const aggregateSessionEmotions = (sessionId: string | null) => {
    if (!sessionId) return [];
    const session = sessions.find(s => s.sessionID === sessionId);
    if (!session) return [];

    const emotionCounts: {[key: string]: number} = {};
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
    if (!session) {
      console.error('Session not found:', sessionId);
      return [];
    }

    if (!session.attendees || session.attendees.length === 0) {
      console.error('No attendees in session');
      return [];
    }

    const allEmotions: {emotion: string; timestamp: Date}[] = [];
    session.attendees.forEach(attendee => {
      if (!attendee.emotions || attendee.emotions.length === 0) {
        console.warn('Attendee has no emotions:', attendee.username);
        return;
      }
      
      attendee.emotions.forEach(emotion => {
        if (!emotion.timestamp) {
          console.warn('Emotion has no timestamp:', emotion);
          return;
        }
        
        const timestamp = emotion.timestamp?.toDate ? emotion.timestamp.toDate() : new Date(emotion.timestamp);
        allEmotions.push({ emotion: emotion.emotion.toLowerCase(), timestamp });
      });
    });

    console.log('All emotions:', allEmotions);

    if (allEmotions.length === 0) {
      console.error('No emotions found after processing');
      return [];
    }

    allEmotions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const firstTime = allEmotions[0].timestamp;
    const lastTime = allEmotions[allEmotions.length - 1].timestamp;
    const totalDuration = lastTime.getTime() - firstTime.getTime();
    const durationMinutes = Math.ceil(totalDuration / 60000);
    const binCount = Math.max(1, Math.ceil(durationMinutes));

    const bins: any[] = [];
    for (let i = 0; i < binCount; i++) {
      const binStart = i * 5;
      const binEnd = (i + 1) * 5;
      const binLabel = `${binStart}-${binEnd}`;

      const binData: any = { time: binLabel };
      Object.keys(EMOTION_COLORS).forEach(emotion => {
        binData[emotion] = 0;
      });

      allEmotions.forEach(({ emotion, timestamp }) => {
        const minutesSinceStart = (timestamp.getTime() - firstTime.getTime()) / 60000;
        if (minutesSinceStart >= binStart && minutesSinceStart < binEnd) {
          binData[emotion] = (binData[emotion] || 0) + 1;
        }
      });

      bins.push(binData);
    }

    console.log('Timeline data:', bins);
    return bins;
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className='h-full w-full flex items-center justify-center text-white bg-[#1c1c1b]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
          <p className='text-gray-400'>Loading your sessions...</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className='h-full w-full flex items-center justify-center text-white bg-[#1c1c1b]'>
        <div className='text-center'>
          <p className='text-gray-400'>No hosted sessions yet</p>
        </div>
      </div>
    );
  }

  const overallStats = calculateOverallStats();
  const overallEmotionData = aggregateAllEmotions();
  const selectedSession = sessions.find(s => s.sessionID === selectedSessionId);
  const sessionEmotionData = aggregateSessionEmotions(selectedSessionId);
  const timelineData = createTimelineData(selectedSessionId);

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
            <h1 className='text-2xl sm:text-3xl font-bold'>
              {selectedSession ? selectedSession.meetingTitle : 'Emotion Analytics'}
            </h1>
            {selectedSession && (
              <button onClick={() => setSelectedSessionId(null)} className='text-sm text-gray-400 hover:text-white transition'>
                ← Back to Overview
              </button>
            )}
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
              <StatCard icon={<Users className='w-5 h-5' />} label="Total Participants" value={overallStats.totalParticipants} />
              <StatCard icon={<Clock className='w-5 h-5' />} label="Avg Session Duration" value={overallStats.avgDuration} />
              <StatCard icon={<BarChart3 className='w-5 h-5' />} label="Total Emotion Records" value={overallStats.totalEmotionSamples} />
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
                        innerRadius={60}
                        outerRadius={100}
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
                <h3 className='text-lg font-semibold mb-2'>Top Emotions</h3>
                <p className='text-xs text-gray-400 mb-4'>Most frequently detected</p>
                <div className='space-y-3 text-sm'>
                  {overallEmotionData.slice(0, 7).map(item => (
                    <div key={item.name}>
                      <div className='flex justify-between mb-1'>
                        <span>{EMOTION_EMOJIS[item.name as keyof typeof EMOTION_EMOJIS]} {item.name}</span>
                        <span className='text-gray-400'>{item.value} ({item.percent}%)</span>
                      </div>
                      <div className='w-full bg-[#2d2d2d] rounded-full h-2'>
                        <div className='h-2 rounded-full' style={{ width: `${item.percent}%`, backgroundColor: EMOTION_COLORS[item.name as keyof typeof EMOTION_COLORS] }}></div>
                      </div>
                    </div>
                  ))}
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
                      <div>
                        <p className='font-medium'>{session.meetingTitle}</p>
                        <p className='text-xs text-gray-400'>{formatDate(session.createdAt)} • {session.participantCount} participants</p>
                      </div>
                      <div className='text-sm text-gray-400'>{session.duration}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
              <StatCard icon={<Users className='w-5 h-5' />} label="Participants" value={selectedSession.participantCount} />
              <StatCard icon={<Clock className='w-5 h-5' />} label="Duration" value={selectedSession.duration} />
              <StatCard icon={<BarChart3 className='w-5 h-5' />} label="Emotion Records" value={selectedSession.emotionCount} />
              <StatCard
                icon={<Smile className='w-5 h-5' />}
                label="Most Frequent"
                value={sessionEmotionData.length > 0 ? `${EMOTION_EMOJIS[sessionEmotionData[0].name as keyof typeof EMOTION_EMOJIS]} ${sessionEmotionData[0].name}` : 'N/A'}
                sublabel={sessionEmotionData.length > 0 ? `${sessionEmotionData[0].percent}%` : ''}
              />
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
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Area type="monotone" dataKey="happiness" stackId="1" stroke={EMOTION_COLORS.happiness} fill={EMOTION_COLORS.happiness} />
                      <Area type="monotone" dataKey="neutral" stackId="1" stroke={EMOTION_COLORS.neutral} fill={EMOTION_COLORS.neutral} />
                      <Area type="monotone" dataKey="fear" stackId="1" stroke={EMOTION_COLORS.fear} fill={EMOTION_COLORS.fear} />
                      <Area type="monotone" dataKey="surprise" stackId="1" stroke={EMOTION_COLORS.surprise} fill={EMOTION_COLORS.surprise} />
                      <Area type="monotone" dataKey="sadness" stackId="1" stroke={EMOTION_COLORS.sadness} fill={EMOTION_COLORS.sadness} />
                      <Area type="monotone" dataKey="anger" stackId="1" stroke={EMOTION_COLORS.anger} fill={EMOTION_COLORS.anger} />
                      <Area type="monotone" dataKey="disgust" stackId="1" stroke={EMOTION_COLORS.disgust} fill={EMOTION_COLORS.disgust} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='h-full flex items-center justify-center text-gray-500'>No timeline data available</div>
                )}
              </div>

              <div className='lg:col-span-2 bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[250px]'>
                <h3 className='text-lg font-semibold mb-2'>Session Distribution</h3>
                <p className='text-xs text-gray-400 mb-4'>All detected emotions</p>
                <div className='space-y-2 text-sm'>
                  {sessionEmotionData.map(item => (
                    <div key={item.name}>
                      <div className='flex justify-between mb-1'>
                        <span>{EMOTION_EMOJIS[item.name as keyof typeof EMOTION_EMOJIS]} {item.name}</span>
                        <span className='text-gray-400'>{item.value} ({item.percent}%)</span>
                      </div>
                      <div className='w-full bg-[#2d2d2d] rounded-full h-2'>
                        <div className='h-2 rounded-full' style={{ width: `${item.percent}%`, backgroundColor: EMOTION_COLORS[item.name as keyof typeof EMOTION_COLORS] }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='lg:col-span-2 bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[250px]'>
                <h3 className='text-lg font-semibold mb-2'>Avg Distribution</h3>
                <p className='text-xs text-gray-400 mb-4'>Your overall average</p>
                <div className='space-y-2 text-sm'>
                  {overallEmotionData.slice(0, 7).map(item => (
                    <div key={item.name}>
                      <div className='flex justify-between mb-1'>
                        <span>{EMOTION_EMOJIS[item.name as keyof typeof EMOTION_EMOJIS]} {item.name}</span>
                        <span className='text-gray-400'>{item.percent}%</span>
                      </div>
                      <div className='w-full bg-[#2d2d2d] rounded-full h-2'>
                        <div className='h-2 rounded-full' style={{ width: `${item.percent}%`, backgroundColor: EMOTION_COLORS[item.name as keyof typeof EMOTION_COLORS] }}></div>
                      </div>
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
                        const peakHappiness = timelineData.reduce((max: any, item: any) => (item.happiness || 0) > (max.happiness || 0) ? item : max, timelineData[0]);
                        return (
                          <div className='p-3 bg-[#2d2d2d] rounded-lg'>
                            <p className='text-xs text-gray-500 mb-1'>Most happiness</p>
                            <p className='font-medium'>{peakHappiness.time} min</p>
                            <p className='text-xs text-gray-400 mt-1'>{peakHappiness.happiness || 0} detections</p>
                          </div>
                        );
                      })()}
                      {(() => {
                        const peakFear = timelineData.reduce((max: any, item: any) => (item.fear || 0) > (max.fear || 0) ? item : max, timelineData[0]);
                        return (
                          <div className='p-3 bg-[#2d2d2d] rounded-lg'>
                            <p className='text-xs text-gray-500 mb-1'>Most fear</p>
                            <p className='font-medium'>{peakFear.time} min</p>
                            <p className='text-xs text-gray-400 mt-1'>{peakFear.fear || 0} detections</p>
                          </div>
                        );
                      })()}
                      {(() => {
                        const peakNeutral = timelineData.reduce((max: any, item: any) => (item.neutral || 0) > (max.neutral || 0) ? item : max, timelineData[0]);
                        return (
                          <div className='p-3 bg-[#2d2d2d] rounded-lg'>
                            <p className='text-xs text-gray-500 mb-1'>Most neutral</p>
                            <p className='font-medium'>{peakNeutral.time} min</p>
                            <p className='text-xs text-gray-400 mt-1'>{peakNeutral.neutral || 0} detections</p>
                          </div>
                        );
                      })()}
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
          className='absolute top-4 -left-10 z-30 p-2 bg-[#1d1d1d] border border-[#2d2d2d] rounded-lg text-gray-400 hover:text-white transition'
        >
          <SidebarIcon className='w-4 h-4' />
        </button>

        <div
          className={`h-full bg-[#1d1d1d] border-l border-[#2d2d2d] transition-all duration-300 ease-in-out ${
            isOpen ? 'w-60 sm:w-72' : 'w-0'
          } overflow-hidden shadow-2xl sm:shadow-none`}
        >
          <div className='p-4 sm:p-6 h-full overflow-auto'>
            <h3 className='text-lg font-semibold mb-4'>Your Sessions</h3>
            <div className='space-y-2'>
              {sessions.map(session => (
                <div
                  key={session.sessionID}
                  onClick={() => {
                    setSelectedSessionId(session.sessionID);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedSessionId === session.sessionID
                      ? 'bg-[#3d3d3d] border border-blue-500/30'
                      : 'bg-[#2d2d2d] hover:bg-[#3d3d3d]'
                  }`}
                >
                  <p className='font-medium text-sm'>{session.meetingTitle}</p>
                  <p className='text-xs text-gray-400 mt-1'>{formatDate(session.createdAt)}</p>
                  <div className='flex items-center justify-between mt-2 text-xs'>
                    <span className='text-gray-500'>{session.participantCount} participants</span>
                    <span className='px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-400'>ended</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Records.layout = (page) => <SidebarLayout>{page}</SidebarLayout>

export default Records;
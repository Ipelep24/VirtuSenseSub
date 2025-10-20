import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
} from 'react';
import { createHook } from 'customization-implementation';
import { UidType, useLocalUid } from '../../../agora-rn-uikit';
import { useRoomInfo } from '../room-info/useRoomInfo';
import events, { PersistanceLevel } from '../../rtm-events-api';
import { EventNames } from '../../rtm-events';
import ChatContext from '../ChatContext';
import { useContent } from 'customization-api';

export interface VideoMeetingDataInterface {
  hostUids: UidType[];
  attendeeUids: UidType[];
}
const VideoMeetingData = createContext<VideoMeetingDataInterface>({
  hostUids: [],
  attendeeUids: [],
});

interface VideoMeetingDataProviderProps {
  children: React.ReactNode;
}
const VideoMeetingDataProvider = (props: VideoMeetingDataProviderProps) => {
  const {
    data: { isHost },
  } = useRoomInfo();
  const { activeUids } = useContent();
  const { hasUserJoinedRTM } = useContext(ChatContext);
  const localUid = useLocalUid();
  const [hostUids, setHostUids] = useState<UidType[]>([]);
  const [attendeeUids, setAttendeeUids] = useState<UidType[]>([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const hostUidsRef = useRef({ hostUids });
  const attendeeUidsRef = useRef({ attendeeUids });

  useEffect(() => {
    hostUidsRef.current.hostUids = hostUids;
  }, [hostUids]);

  useEffect(() => {
    attendeeUidsRef.current.attendeeUids = attendeeUids;
  }, [attendeeUids]);

  useEffect(() => {
    isHost ? setHostUids([localUid]) : setAttendeeUids([localUid]);

    events.on(EventNames.VIDEO_MEETING_HOST, (data) => {
      const payload = JSON.parse(data?.payload);
      const hostUid = payload?.uid;
      if (hostUid && hostUidsRef.current.hostUids.indexOf(hostUid) === -1) {
        setHostUids([...hostUidsRef.current.hostUids, hostUid]);
      }
    });

    events.on(EventNames.VIDEO_MEETING_ATTENDEE, (data) => {
      const payload = JSON.parse(data?.payload);
      const attendeeUid = payload?.uid;
      if (
        attendeeUid &&
        attendeeUidsRef.current.attendeeUids.indexOf(attendeeUid) === -1
      ) {
        setAttendeeUids([
          ...attendeeUidsRef.current.attendeeUids,
          attendeeUid,
        ]);
      }
    });

    return () => {
      events.off(EventNames.VIDEO_MEETING_HOST);
      events.off(EventNames.VIDEO_MEETING_ATTENDEE);
    };
  }, []);

  useEffect(() => {
    if (hasUserJoinedRTM) {
      events.send(
        isHost ? EventNames.VIDEO_MEETING_HOST : EventNames.VIDEO_MEETING_ATTENDEE,
        JSON.stringify({ uid: localUid }),
        PersistanceLevel.Sender
      );
    }
  }, [isHost, hasUserJoinedRTM]);

  // Rebroadcast role when activeUids change (late joiner support)
  useEffect(() => {
    if (hasUserJoinedRTM) {
      events.send(
        isHost ? EventNames.VIDEO_MEETING_HOST : EventNames.VIDEO_MEETING_ATTENDEE,
        JSON.stringify({ uid: localUid }),
        PersistanceLevel.Sender
      );
    }
    forceUpdate(); // trigger re-render for filtered lists
  }, [activeUids]);

  useEffect(() => {
    const filteredHosts = hostUids.filter((i) => activeUids.includes(i));
    const filteredAttendees = attendeeUids.filter((i) => activeUids.includes(i));

    localStorage.setItem('totalHosts', String(filteredHosts.length));
    localStorage.setItem('totalAttendees', String(filteredAttendees.length));

    console.log('Total Hosts:', localStorage.getItem('totalHosts'));
    console.log('Total Attendees:', localStorage.getItem('totalAttendees'));

    window.dispatchEvent(new CustomEvent('fer:totalHostsChanged', {
      detail: { totalHosts: filteredHosts.length }
    }));
  }, [hostUids, attendeeUids, activeUids, isHost, localUid]);

  return (
    <VideoMeetingData.Provider
      value={{
        hostUids: hostUids.filter((i) => activeUids.includes(i)),
        attendeeUids: attendeeUids.filter((i) => activeUids.includes(i)),
      }}
    >
      {props.children}
    </VideoMeetingData.Provider>
  );
};

const useVideoMeetingData = createHook(VideoMeetingData);

export { useVideoMeetingData, VideoMeetingDataProvider };
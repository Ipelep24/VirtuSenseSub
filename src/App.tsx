import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Platform } from 'react-native';
import './index.css'
import KeyboardManager from 'react-native-keyboard-manager';
import AppWrapper from './AppWrapper';
import {
  RoomInfoContextInterface,
  RoomInfoDefaultValue,
  RoomInfoProvider,
} from './components/room-info/useRoomInfo';
import { SetRoomInfoProvider } from './components/room-info/useSetRoomInfo';
import { ShareLinkProvider } from './components/useShareLink';
import AppRoutes from './AppRoutes';
import { isWebInternal } from './utils/common';
import LocalEventEmitter, { LocalEventsEnum } from './rtm-events-api/LocalEvents';
import { AuthProvider } from './pages/auth/AuthContext';
import { useHistory } from 'react-router-dom';
import faviconSrc from './assets/logo.png'

// hook can't be used in the outside react function calls. so directly checking the platform.
if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setEnableAutoToolbar(false);
  KeyboardManager.setShouldShowToolbarPlaceholder(false);
  KeyboardManager.setShouldResignOnTouchOutside(true);
}

//Extending the UI Kit Type defintion to add custom attribute to render interface
declare module 'agora-rn-uikit' {
  // interface DefaultContentInterface {
  //   name: string;
  //   screenUid: number;
  //   offline: boolean;
  //   lastMessageTimeStamp: number;
  // }
  // interface RtcPropsInterface {
  //   screenShareUid: number;
  //   screenShareToken?: string;
  // }
}

declare global {
  interface Navigator {
    notifyReady?: () => boolean;
  }
}

const App: React.FC = () => {
  const history = useHistory()
  //commented for v1 release
  //const CustomRoutes = useCustomization((data) => data?.customRoutes);
  // const RenderCustomRoutes = () => {
  //   try {
  //     return (
  //       CustomRoutes &&
  //       Array.isArray(CustomRoutes) &&
  //       CustomRoutes.length &&
  //       CustomRoutes?.map((item: CustomRoutesInterface, i: number) => {
  //         let RouteComponent = item?.isPrivateRoute ? PrivateRoute : Route;
  //         return (
  //           <RouteComponent
  //             path={CUSTOM_ROUTES_PREFIX + item.path}
  //             exact={item.exact}
  //             key={i}
  //             failureRedirectTo={
  //               item.failureRedirectTo ? item.failureRedirectTo : '/'
  //             }
  //             {...item.routeProps}>
  //             <item.component {...item.componentProps} />
  //           </RouteComponent>
  //         );
  //       })
  //     );
  //   } catch (error) {
  //     console.error('Error on rendering the custom routes');
  //     return null;
  //   }
  // };

  const notifyReady = () => {
    if (typeof window.navigator.notifyReady === 'function') {
      console.log('recording-bot: notifyReady is available');
      window.navigator.notifyReady();
    } else {
      console.log('recording-bot: notifyReady is un-available');
    }
  };

  useLayoutEffect(() => {
    if (isWebInternal()) {
      // Register only on web
      window.addEventListener('load', notifyReady);
    }
    return () => {
      if (isWebInternal()) {
        window.removeEventListener('load', notifyReady);
      }
    };
  }, []);

  const updateToken = token => {
    setRoomInfo(prevState => {
      return {
        ...prevState,
        loginToken: token,
      };
    });
  };

  useEffect(() => {
    LocalEventEmitter.on(LocalEventsEnum.SDK_TOKEN_CHANGED, updateToken);
    return () => {
      LocalEventEmitter.off(LocalEventsEnum.SDK_TOKEN_CHANGED, updateToken);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'firebaseLogout') {
        history.push('/auth') // Redirect to login
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const [roomInfo, setRoomInfo] =
    useState<RoomInfoContextInterface>(RoomInfoDefaultValue);

  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']") || document.createElement("link")
    favicon.setAttribute("rel", "icon")
    favicon.setAttribute("type", "image/png")
    favicon.setAttribute("href", faviconSrc) // ✅ uses imported path
    document.head.appendChild(favicon)
  }, [])

  return (
    <AppWrapper>
      <SetRoomInfoProvider value={{ setRoomInfo }}>
        <RoomInfoProvider value={{ ...roomInfo }}>
          <ShareLinkProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ShareLinkProvider>
        </RoomInfoProvider>
      </SetRoomInfoProvider>
    </AppWrapper>
  );
};

export default App;

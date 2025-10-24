import React from 'react';
import Join from './pages/Join';
import VideoCall from './pages/VideoCall';
import Create from './pages/Create';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import { Route, Switch, Redirect } from './components/Router';
import { IDPAuth } from './auth/IDPAuth';
import AuthRoute from './auth/AuthRoute'; // ✅ Firebase-aware route guard
import { Text } from 'react-native';
import { useCustomization } from 'customization-implementation';
import { CUSTOM_ROUTES_PREFIX, CustomRoutesInterface } from 'customization-api';
import PrivateRoute from './components/PrivateRoute';
import RecordingBotRoute from './components/recording-bot/RecordingBotRoute';
import { useIsRecordingBot } from './subComponents/recording/useIsRecordingBot';
import { isValidReactComponent } from './utils/common';
import ErrorBoundary from './components/ErrorBoundary';
import { ErrorBoundaryFallback } from './components/ErrorBoundaryFallback';
import Endcall from './pages/Endcall';
import TabLocked from './pages/TabLocked';
import Troubleshooting from './pages/Troubleshooting';

function VideoCallWrapper(props) {
  const { isRecordingBot } = useIsRecordingBot();
  const ErrorBoundaryFallbackComponent = <ErrorBoundaryFallback />;
  return isRecordingBot ? (
    <RecordingBotRoute history={props.history}>
      <ErrorBoundary fallback={ErrorBoundaryFallbackComponent}>
        <VideoCall />
      </ErrorBoundary>
    </RecordingBotRoute>
  ) : (
    <ErrorBoundary fallback={ErrorBoundaryFallbackComponent}>
      <VideoCall />
    </ErrorBoundary>
  );
}

function AppRoutes() {
  const CustomRoutes = useCustomization(data => data?.customRoutes);
  const AppConfig = useCustomization(data => data?.config);
  const { defaultRootFallback: DefaultRootFallback } = AppConfig || {};

  const renderWithLayout = (Component: React.FC & { layout?: (page: React.ReactNode) => JSX.Element }) => {
    const Layout = Component.layout || ((page) => page);
    return Layout(<Component />);
  };

  const RenderCustomRoutes = () => {
    try {
      return (
        CustomRoutes &&
        Array.isArray(CustomRoutes) &&
        CustomRoutes.length &&
        CustomRoutes.map((item: CustomRoutesInterface, i: number) => {
          const RouteComponent = item?.isPrivateRoute ? PrivateRoute : Route;
          return (
            <RouteComponent
              path={
                item.isTopLevelRoute
                  ? item.path
                  : CUSTOM_ROUTES_PREFIX + item.path
              }
              exact={item.exact}
              key={i}
              failureRedirectTo={item.failureRedirectTo || '/'}
              {...item.routeProps}
            >
              <item.component {...item.componentProps} />
            </RouteComponent>
          );
        })
      );
    } catch (error) {
      console.error('Error on rendering the custom routes');
      return null;
    }
  };

  return (
    <Switch>
      <Route exact path="/auth">
        <Auth />
      </Route>

      <Route exact path="/tab-locked">
        <TabLocked />
      </Route>

      <AuthRoute exact path="/submit-ticket">
        <Troubleshooting />
      </AuthRoute>

      <AuthRoute exact path="/">
        {renderWithLayout(Dashboard)}
      </AuthRoute>

      <AuthRoute exact path="/records">
        {renderWithLayout(Records)}
      </AuthRoute>

      <AuthRoute exact path="/join">
        <Join />
      </AuthRoute>

      <AuthRoute exact path="/create">
        <Create />
      </AuthRoute>

      <AuthRoute exact path="/endcall">
        <Endcall />
      </AuthRoute>

      <Route exact path="/authorize/:token?">
        <IDPAuth />
      </Route>

      {RenderCustomRoutes()}

      <AuthRoute exact path="/:phrase">
        <VideoCallWrapper />
      </AuthRoute>
      <Route path="*">
        <Text>Page not found</Text>
      </Route>
    </Switch>
  );
}

export default AppRoutes;
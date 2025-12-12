import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SidePanelType } from '../subComponents/SidePanelEnum';
import { isMobileUA, isWebInternal, useIsSmall } from '../utils/common';
import CommonStyles from './CommonStyles';
import { TestPanelHeader } from '../pages/video-call/SidePanelHeader';
import { useLayout } from 'customization-api';
import { getGridLayoutName } from '../pages/video-call/DefaultLayouts';
import useCaptionWidth from '../subComponents/caption/useCaptionWidth';
import { useEmotionSnapshots } from './EmotionSnapshotContext';

const TestPanel = (props) => {
  const { showHeader = true } = props;
  const isSmall = useIsSmall();
  const { currentLayout } = useLayout();
  const { transcriptHeight } = useCaptionWidth();
  
  const snapshots = useEmotionSnapshots();

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'Positive': return '#10b981';
      case 'Negative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <View
      testID="videocall-testpanel"
      style={[
        isMobileUA()
          ? CommonStyles.sidePanelContainerNative
          : isSmall()
            ? CommonStyles.sidePanelContainerWebMinimzed
            : CommonStyles.sidePanelContainerWeb,
        isWebInternal() && !isSmall() && currentLayout === getGridLayoutName()
          ? { marginTop: 4 }
          : {},
        transcriptHeight && !isMobileUA() && { height: transcriptHeight as any },
      ]}>
      {showHeader && <TestPanelHeader />}

      <ScrollView style={style.bodyContainer}>
        {snapshots.length === 0 ? (
          <View style={style.centerContent}>
            <Text style={style.emptyText}>Nothing to show yet.</Text>
            <Text style={[style.emptyText, { marginTop: 8 }]}>Ask your participants to open their cameras</Text>
          </View>
        ) : (
          <View style={style.content}>
            {snapshots.map((snapshot, index) => (
              <View key={index}>
                {/* Chat-style timestamp */}
                <Text style={style.timestampText}>{snapshot.timeRange}</Text>
                
                {/* Snapshot card */}
                {snapshot.percentage === 0 ? (
                  // Empty interval - just text, no card
                  <Text style={style.emptyIntervalText}>
                    {snapshot.summary}
                  </Text>
                ) : (
                  // Normal snapshot content with card
                  <View style={style.snapshotCard}>
                    <Text style={[style.engagementText, { color: getEngagementColor(snapshot.engagement) }]}>
                      {snapshot.engagement}
                    </Text>
                    <View style={style.statsRow}>
                      <Text style={style.percentText}>{snapshot.percentage}%</Text>
                      <Text style={style.participantText}>
                        {snapshot.participantCount} {snapshot.participantCount === 1 ? 'participant' : 'participants'}
                      </Text>
                    </View>
                    <Text style={style.summaryText}>{snapshot.summary}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  bodyContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: $config.FONT_COLOR,
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
  },
  // Chat-style timestamp
  timestampText: {
    color: $config.FONT_COLOR,
    fontSize: 11,
    opacity: 0.4,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  snapshotCard: {
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: $config.CARD_LAYER_3_COLOR,
    padding: 12,
    marginBottom: 8,
  },
  emptyIntervalText: {
    color: $config.FONT_COLOR,
    fontSize: 13,
    opacity: 0.4,
    textAlign: 'center',
    paddingVertical: 4,
    marginBottom: 8,
  },
  engagementText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentText: {
    color: $config.FONT_COLOR,
    fontSize: 16,
    fontWeight: '600',
  },
  participantText: {
    color: $config.FONT_COLOR,
    fontSize: 12,
    opacity: 0.6,
  },
  summaryText: {
    color: $config.FONT_COLOR,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
});

export default TestPanel;
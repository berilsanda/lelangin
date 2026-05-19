import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/spacing';
import type { Auction } from '@/types';

import { AuctionCard } from './AuctionCard';
import { AuctionSkeleton } from './AuctionSkeleton';

interface Props {
  data: Auction[];
  onEndReached: () => void;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

const SKELETON_COUNT = 4;

function renderSkeleton() {
  return (
    <View>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <AuctionSkeleton key={i} />
      ))}
    </View>
  );
}

export function AuctionList({ data, onEndReached, fetchNextPage, isFetchingNextPage }: Props) {
  function handleEndReached() {
    onEndReached();
    fetchNextPage();
  }

  return (
    <FlashList
      data={data}
      keyExtractor={(a) => a.id}
      renderItem={({ item }) => <AuctionCard auction={item} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? renderSkeleton : null}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
});

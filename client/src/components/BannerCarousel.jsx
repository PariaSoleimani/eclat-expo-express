import { useCallback, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { COLORS } from '@/lib/colors';

const BannerCarousel = ({ banners, onExplore, paddingHorizontal = 0 , bannerButtonText = 'Explore'}) => {
	const [activeBannerIndex, setActiveBannerIndex] = useState(0);
	const { width: screenWidth } = useWindowDimensions();
	const bannerWidth = screenWidth - paddingHorizontal * 2;
	const snapToInterval = bannerWidth + styles.bannerScroll.gap;

	const handleScroll = useCallback(
		event => {
			const offsetX = event.nativeEvent.contentOffset.x;
			const nextIndex = Math.round(offsetX / snapToInterval);
			setActiveBannerIndex(currentIndex => (currentIndex === nextIndex ? currentIndex : nextIndex));
		},
		[snapToInterval],
	);

	return (
		<View>
			<ScrollView
				contentContainerStyle={styles.bannerScroll}
				horizontal
				showsHorizontalScrollIndicator={false}
				snapToInterval={snapToInterval}
				decelerationRate="fast"
				disableIntervalMomentum
				scrollEventThrottle={16}
				onScroll={handleScroll}>
				{banners.map(banner => (
					<ImageBackground
						key={banner.id}
						source={{ uri: banner.url }}
						style={[styles.banner, { width: bannerWidth }]}
						imageStyle={styles.bannerImage}>
						<View style={styles.bannerOverlay} />
						<View style={styles.bannerContent}>
							<Text style={styles.bannerTitle}>{banner.title}</Text>
							<Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
							<Pressable
								style={styles.bannerButton}
								onPress={onExplore}>
								<Text style={styles.bannerButtonText}>{bannerButtonText}</Text>
							</Pressable>
						</View>
					</ImageBackground>
				))}
			</ScrollView>

			<View style={styles.dots}>
				{banners.map((banner, index) => (
					<View
						key={banner.id}
						style={[styles.dot, index === activeBannerIndex && styles.activeDot]}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	bannerScroll: { gap: 12 },
	banner: { height: 215, justifyContent: 'flex-end' },
	bannerImage: { borderRadius: 18 },
	bannerOverlay: {
		backgroundColor: 'rgba(30, 24, 18, 0.38)',
		borderRadius: 18,
		bottom: 0,
		left: 0,
		position: 'absolute',
		right: 0,
		top: 0,
	},
	bannerContent: { gap: 4, padding: 22 },
	bannerTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '800', letterSpacing: 0.2 },
	bannerSubtitle: { color: '#FFFFFF', fontSize: 14 },
	bannerButton: {
		alignSelf: 'flex-start',
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		marginTop: 10,
		paddingHorizontal: 14,
		paddingVertical: 9,
	},
	bannerButtonText: { color: COLORS.primary.DEFAULT, fontSize: 12, fontWeight: '800' },
	dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: 12 },
	dot: { backgroundColor: COLORS.primary[300], borderRadius: 4, height: 7, width: 7 },
	activeDot: { backgroundColor: COLORS.primary.DEFAULT, width: 22 },
});

export default BannerCarousel;

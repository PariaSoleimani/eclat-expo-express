import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenState from '@/components/common/ScreenState';
import Header from '@/components/Header';
import { getBlogPosts } from '@/services/blog';
import { COLORS } from '@/lib/colors';

const BlogScreen = () => {
	const router = useRouter();
	const [blogPosts, setBlogPosts] = useState([]);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const loadBlogPosts = useCallback(async () => {
		setIsLoading(true);
		setError('');

		try {
			setBlogPosts(await getBlogPosts());
		} catch (requestError) {
			setError(requestError.message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadBlogPosts();
	}, [loadBlogPosts]);

	return (
		<View style={styles.screen}>
			<Header
				title="Journal"
				showBack
				showCart
			/>
			{isLoading ? (
				<ScreenState
					mode="loading"
					title="Loading journal"
					description="Finding the latest Éclat stories."
				/>
			) : error ? (
				<ScreenState
					mode="error"
					title="Could not load the journal"
					description={error}
					actionLabel="Try again"
					onAction={loadBlogPosts}
				/>
			) : blogPosts.length === 0 ? (
				<ScreenState
					icon="document-text-outline"
					title="No stories yet"
					description="Please check back soon for new Journal entries."
				/>
			) : (
				<ScrollView contentContainerStyle={styles.content}>
					<View style={styles.intro}>
						<Text style={styles.eyebrow}>THE ÉCLAT JOURNAL</Text>
						<Text style={styles.title}>Stories behind the sparkle</Text>
						<Text style={styles.copy}>
							Care notes, styling rituals, and inspiration for every piece you make your own.
						</Text>
					</View>
					{blogPosts.map(post => (
						<Pressable
							key={post.id}
							onPress={() => router.push(`/blog/${post.slug}`)}
							style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
							<Image
								source={{ uri: post.url }}
								style={styles.image}
							/>
							<View style={styles.cardContent}>
								<View style={styles.meta}>
									<Text style={styles.category}>{post.category}</Text>
									<Text style={styles.readTime}>{post.read_time}</Text>
								</View>
								<Text style={styles.cardTitle}>{post.title}</Text>
								<Text style={styles.excerpt}>{post.excerpt}</Text>
								<Text style={styles.readMore}>Read story →</Text>
							</View>
						</Pressable>
					))}
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	screen: { backgroundColor: COLORS.background.DEFAULT, flex: 1 },
	content: { padding: 18 },
	intro: { marginBottom: 23, paddingTop: 7 },
	eyebrow: { color: COLORS.accent[900], fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
	title: { color: COLORS.primary.DEFAULT, fontSize: 26, fontWeight: '800', marginTop: 7 },
	copy: { color: COLORS.secondary.DEFAULT, fontSize: 14, lineHeight: 21, marginTop: 8 },
	card: { backgroundColor: COLORS.surface.DEFAULT, borderRadius: 17, marginBottom: 17, overflow: 'hidden' },
	cardPressed: { opacity: 0.8 },
	image: { height: 175, width: '100%' },
	cardContent: { padding: 16 },
	meta: { flexDirection: 'row', justifyContent: 'space-between' },
	category: {
		color: COLORS.accent[900],
		fontSize: 11,
		fontWeight: '800',
		letterSpacing: 0.4,
		textTransform: 'uppercase',
	},
	readTime: { color: COLORS.secondary.DEFAULT, fontSize: 11 },
	cardTitle: { color: COLORS.primary.DEFAULT, fontSize: 18, fontWeight: '800', marginTop: 10 },
	excerpt: { color: COLORS.secondary.DEFAULT, fontSize: 13, lineHeight: 19, marginTop: 7 },
	readMore: { color: COLORS.primary.DEFAULT, fontSize: 13, fontWeight: '800', marginTop: 13 },
});

export default BlogScreen;

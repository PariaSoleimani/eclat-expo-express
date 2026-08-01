import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenState from '@/components/common/ScreenState';
import Header from '@/components/Header';
import { getBlogPostBySlug } from '@/services/blog';
import { COLORS } from '@/lib/colors';

const BlogArticleScreen = () => {
	const { slug } = useLocalSearchParams();
	const router = useRouter();
	const postSlug = Array.isArray(slug) ? slug[0] : slug;
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [post, setPost] = useState(null);
	const [status, setStatus] = useState(null);

	const loadPost = useCallback(async () => {
		if (!postSlug) {
			setError('This story does not have a valid link.');
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError('');
		setStatus(null);

		try {
			setPost(await getBlogPostBySlug(postSlug));
		} catch (requestError) {
			setError(requestError.message);
			setStatus(requestError.status);
		} finally {
			setIsLoading(false);
		}
	}, [postSlug]);

	useEffect(() => {
		loadPost();
	}, [loadPost]);

	if (isLoading) {
		return (
			<View style={styles.screen}>
				<Header
					title="Journal"
					showBack
					showCart
				/>
				<ScreenState
					mode="loading"
					title="Loading story"
					description="Opening the Journal entry."
				/>
			</View>
		);
	}

	if (status === 404) {
		return (
			<View style={styles.screen}>
				<Header
					title="Journal"
					showBack
					showCart
				/>
				<ScreenState
					icon="document-text-outline"
					title="Story not found"
					description="This journal story is no longer available."
					actionLabel="Back to journal"
					onAction={() => router.replace('/blog')}
				/>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.screen}>
				<Header
					title="Journal"
					showBack
					showCart
				/>
				<ScreenState
					mode="error"
					title="Could not load the story"
					description={error}
					actionLabel="Try again"
					onAction={loadPost}
				/>
			</View>
		);
	}

	return (
		<View style={styles.screen}>
			<Header
				title="Journal"
				showBack
				showCart
			/>
			<ScrollView contentContainerStyle={styles.content}>
				<Image
					source={{ uri: post.imageUrl }}
					style={styles.image}
				/>
				<Text style={styles.category}>{post.category}</Text>
				<Text style={styles.title}>{post.title}</Text>
				<Text style={styles.meta}>
					{new Date(post.publishedAt).toLocaleDateString(undefined, {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					})}{' '}
					· {post.readTime}
				</Text>
				{post.content.map(paragraph => (
					<Text
						key={paragraph}
						style={styles.paragraph}>
						{paragraph}
					</Text>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: { backgroundColor: COLORS.background.DEFAULT, flex: 1 },
	content: { paddingBottom: 32 },
	image: { height: 250, width: '100%' },
	category: {
		color: COLORS.accent[900],
		fontSize: 11,
		fontWeight: '800',
		letterSpacing: 0.7,
		marginHorizontal: 18,
		marginTop: 22,
		textTransform: 'uppercase',
	},
	title: {
		color: COLORS.primary.DEFAULT,
		fontSize: 27,
		fontWeight: '800',
		lineHeight: 34,
		marginHorizontal: 18,
		marginTop: 8,
	},
	meta: { color: COLORS.secondary.DEFAULT, fontSize: 12, marginHorizontal: 18, marginTop: 9 },
	paragraph: { color: COLORS.secondary[900], fontSize: 15, lineHeight: 24, marginHorizontal: 18, marginTop: 19 },
});

export default BlogArticleScreen;

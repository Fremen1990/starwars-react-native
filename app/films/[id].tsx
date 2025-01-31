import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from "react-native";
import { COLORS } from "@/constants/colors";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Film } from "@/types/film";
import { Stack } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { FAVORITES_KEY } from "@/constants/keys";

const FilmById = () => {
    const { id } = useLocalSearchParams();
    const [film, setFilm] = useState<Film | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [characters, setCharacters] = useState<string[]>([]);
    const [planets, setPlanets] = useState<string[]>([]);
    const [starships, setStarships] = useState<string[]>([]);
    const [vehicles, setVehicles] = useState<string[]>([]);

    useEffect(() => {
        fetchFilmById();
    }, [id]);

    const fetchFilmById = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://swapi.dev/api/films/${id}/`);
            const data: Film = await response.json();
            setFilm(data);
            await checkFavoriteStatus(data);
            fetchRelatedData("characters", data.characters, setCharacters);
            fetchRelatedData("planets", data.planets, setPlanets);
            fetchRelatedData("starships", data.starships, setStarships);
            fetchRelatedData("vehicles", data.vehicles, setVehicles);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedData = async (type: string, urls: string[], setState: (data: string[]) => void) => {
        try {
            const results = await Promise.all(
                urls.map(async (url) => {
                    const res = await fetch(url);
                    const json = await res.json();
                    return json.title || json.name;
                })
            );
            setState(results);
        } catch (e) {
            console.error(`Failed to fetch ${type}`, e);
        }
    };

    const checkFavoriteStatus = async (film: Film) => {
        try {
            const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
            if (favorites) {
                const parsedFavorites = JSON.parse(favorites) as Film[];
                setIsFavorite(parsedFavorites.some((f) => f.episode_id === film.episode_id));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleFavorite = async () => {
        try {
            const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
            let favoriteFilms = favorites ? JSON.parse(favorites) as Film[] : [];

            if (!film) return;

            if (isFavorite) {
                favoriteFilms = favoriteFilms.filter((f) => f.episode_id !== film.episode_id);
            } else {
                favoriteFilms.push(film);
            }
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteFilms));
            setIsFavorite(!isFavorite);
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.text} />
            </View>
        );
    }

    if (!film) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.noFilmText}>Film not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerRight: () => (
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={COLORS.text}
                        style={{ marginRight: 16 }}
                        onPress={toggleFavorite}
                    />
                )
            }} />

            {/* Header with Image */}
            <View style={styles.headerContainer}>
                <Image
                    source={{ uri: `https://starwars-visualguide.com/assets/img/films/${id}.jpg` }}
                    style={styles.filmImage}
                    defaultSource={require("@/assets/images/react-logo.png")}
                />
                <Text style={styles.title}>{film.title}</Text>
            </View>

            {/* Film Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Film Details</Text>
                <DetailItem label="Episode" value={`Episode ${film.episode_id}`} />
                <DetailItem label="Director" value={film.director} />
                <DetailItem label="Producer" value={film.producer} />
                <DetailItem label="Release Date" value={film.release_date} />
            </View>

            {/* Opening Crawl */}
            <View style={styles.crawlContainer}>
                <Text style={styles.sectionTitle}>Opening Crawl</Text>
                <Text style={styles.crawlText}>{film.opening_crawl}</Text>
            </View>

            {/* Related Data Sections */}
            {characters.length > 0 && <RelatedSection title="Characters" data={characters} icon="👤" />}
            {planets.length > 0 && <RelatedSection title="Planets" data={planets} icon="🌍" />}
            {starships.length > 0 && <RelatedSection title="Starships" data={starships} icon="🚀" />}
            {vehicles.length > 0 && <RelatedSection title="Vehicles" data={vehicles} icon="🚗" />}
        </ScrollView>
    );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const RelatedSection = ({ title, data, icon }: { title: string; data: string[]; icon: string }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.map((item, index) => (
            <Text key={index} style={styles.itemText}>{icon} {item}</Text>
        ))}
    </View>
);

export default FilmById;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.containerBackground,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 16,
    },
    filmImage: {
        width: 200,
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.text,
        textAlign: "center",
    },
    section: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: COLORS.containerBackground,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 8,
    },
    crawlContainer: {
        padding: 16,
        backgroundColor: COLORS.containerBackground,
        borderRadius: 8,
    },
    crawlText: {
        fontSize: 14,
        color: COLORS.textLight,
        fontStyle: "italic",
    },
    detailItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.text,
    },
    detailValue: {
        fontSize: 16,
        color: COLORS.text,
    },
    itemText: {
        fontSize: 16,
        color: COLORS.text,
    },
    noFilmText: {
        fontSize: 20,
        color: COLORS.text,
    },
});

import {useEffect, useState} from "react";
import {useLocalSearchParams} from "expo-router";
import {ScrollView, Text, StyleSheet, View, ActivityIndicator, Image} from "react-native";
import {Person} from "@/types/people";
import {COLORS} from "@/constants/colors";

const PeopleById = () => {
    const {id} = useLocalSearchParams();
    const [personDetails, setPersonDetails] = useState<Person | null>(null);
    const [loading, setLoading] = useState(true);
    const [films, setFilms] = useState<string[]>([]);
    const [vehicles, setVehicles] = useState<string[]>([]);
    const [starships, setStarships] = useState<string[]>([]);

    const fetchPersonById = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://swapi.dev/api/people/${id}/`);
            const data: Person = await response.json();
            setPersonDetails(data);

            await fetchRelatedData("films", data.films, setFilms);
            await fetchRelatedData("vehicles", data.vehicles, setVehicles);
            await fetchRelatedData("starships", data.starships, setStarships);
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

    useEffect(() => {
        fetchPersonById();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.text}/>
            </View>
        );
    }

    if (!personDetails) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.itemText}>Error fetching character details.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Character Name */}
            <View style={styles.headerContainer}>
                <Image
                    source={{uri: `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}}
                    style={styles.characterImage}
                    defaultSource={require("@/assets/images/react-logo.png")}
                />
                <Text style={styles.headerText}>{personDetails.name}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Character Details</Text>
                <DetailItem label="Height" value={`${personDetails.height} cm`}/>
                <DetailItem label="Mass" value={`${personDetails.mass} kg`}/>
                <DetailItem label="Hair Color" value={personDetails.hair_color}/>
                <DetailItem label="Skin Color" value={personDetails.skin_color}/>
                <DetailItem label="Eye Color" value={personDetails.eye_color}/>
                <DetailItem label="Birth Year" value={personDetails.birth_year}/>
                <DetailItem label="Gender" value={personDetails.gender}/>
            </View>

            {/* Films Section */}
            {films.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appeared In</Text>
                    {films.map((film, index) => (
                        <Text key={index} style={styles.itemText}>🎬 {film}</Text>
                    ))}
                </View>
            )}

            {/* Vehicles Section */}
            {vehicles.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vehicles</Text>
                    {vehicles.map((vehicle, index) => (
                        <Text key={index} style={styles.itemText}>🚗 {vehicle}</Text>
                    ))}
                </View>
            )}

            {/* Starships Section */}
            {starships.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Starships</Text>
                    {starships.map((starship, index) => (
                        <Text key={index} style={styles.itemText}>🚀 {starship}</Text>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const DetailItem = ({label, value}: { label: string; value: string }) => (
    <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

export default PeopleById;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
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
    characterImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: COLORS.text,
    },
    headerText: {
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
    itemText: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 4,
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
});

import {FlatList, ActivityIndicator} from "react-native";
import {useEffect, useState} from "react";
import {Person} from "@/types/people";
import {COLORS} from "@/constants/colors";
import PeopleItem from "@/components/PeopleItem";

const API_URL = 'https://swapi.dev/api/people/';

const People = () => {
    const [nextPage, setNextPage] = useState<string | null>(API_URL);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [people, setPeople] = useState<Person[]>([]);


    const fetchPeople = async (url: string, isRefreshing = false) => {
        if (!url) return;

        setLoading(true);
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("?? ~ fetchPeople ~ data", data)
            setPeople(prevPeople => isRefreshing ? data.results : [...prevPeople, ...data.results]);
            setNextPage(data.next);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        fetchPeople(API_URL);
    }, []);


    const handleLoadMore = () => {
        if (!loading && nextPage) {
            fetchPeople(nextPage);
        }
    }

    const handleRefresh = () => {
        setRefreshing(true);
        setPeople([]);
        fetchPeople(API_URL, true);
    }


    return (
        <FlatList
            data={people}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
                <PeopleItem item={item}/>
            )}
            onEndReached={handleLoadMore}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={
                loading ? <ActivityIndicator size="large" color={COLORS.text}/> : null
            }

        />
    )
}

export default People;
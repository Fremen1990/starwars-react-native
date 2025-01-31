import {Stack} from "expo-router";
import {COLORS} from "@/constants/colors";

const PeopleLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: COLORS.background
                },
                headerTintColor: COLORS.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                contentStyle: {
                    backgroundColor: COLORS.background
                }
            }}
        >

            <Stack.Screen name="index" options={{
                title: "All People",}}
            />
            <Stack.Screen name="[id]" options={{title: "Person Details"}}/>
        </Stack>


    )
}

export default PeopleLayout;
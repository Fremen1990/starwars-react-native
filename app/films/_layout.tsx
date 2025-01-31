import {Stack} from "expo-router";
import {COLORS} from "@/constants/colors";

const FilmsLayout = () => {
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
                title: "All Films",
            }}/>
            <Stack.Screen name="[id]" options={{title: "Film Details"}}/>

        </Stack>
    )
}

export default FilmsLayout;
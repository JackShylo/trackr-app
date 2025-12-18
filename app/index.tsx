import { Redirect } from "expo-router";

const Index = () => {
  // Redirect to the home screen within the (tabs) group
  return <Redirect href="/(tabs)/lists" />;
};

export default Index;

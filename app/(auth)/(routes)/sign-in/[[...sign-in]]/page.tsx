import { SignIn } from "@clerk/nextjs";

// authentication for sign in page done by clerk
// installed clerk and then imported the package
export default function Page() {
  return <SignIn path="/sign-in" />;
}
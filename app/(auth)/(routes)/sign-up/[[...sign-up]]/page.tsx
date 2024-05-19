import { SignUp } from "@clerk/nextjs";

// authentication for sign up page done by clerk
// installed clerk and then imported the package
export default function Page() {
  return <SignUp path="/sign-up" />;
}
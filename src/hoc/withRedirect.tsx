import { WithRedirectProps } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

const withRedirect = <P extends object>(
  Component: React.ComponentType<P & WithRedirectProps>
) => {
  return function WithRedirect(props: P) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");

    const redirectTo = () => {
      if (redirect) {
        router.push(redirect);
      }
    };

    return (
      <Component {...props} redirect={redirectTo} pathRedirect={redirect} />
    );
  };
};

export { withRedirect };

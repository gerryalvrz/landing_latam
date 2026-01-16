import LoginForm from "./LoginForm";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { next?: string | string[] };
}) {
  const nextRaw = searchParams?.next;
  const next =
    typeof nextRaw === "string"
      ? nextRaw
      : Array.isArray(nextRaw) && typeof nextRaw[0] === "string"
        ? nextRaw[0]
        : "/admin";

  return <LoginForm nextPath={next} />;
}






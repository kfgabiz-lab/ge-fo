import SupportFilterPageShell, {
  type SupportFilterPageShellProps,
} from "@/app/support/components/SupportFilterPageShell";

type TechHubPageShellProps = Omit<SupportFilterPageShellProps, "variant">;

export default function TechHubPageShell(props: TechHubPageShellProps) {
  return <SupportFilterPageShell variant="tech-hub" {...props} />;
}

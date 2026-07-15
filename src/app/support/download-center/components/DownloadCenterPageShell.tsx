import SupportFilterPageShell, {
  type SupportFilterPageShellProps,
} from "@/app/support/components/SupportFilterPageShell";

type DownloadCenterPageShellProps = Omit<
  SupportFilterPageShellProps,
  "variant"
>;

export default function DownloadCenterPageShell(
  props: DownloadCenterPageShellProps,
) {
  return <SupportFilterPageShell variant="download-center" {...props} />;
}

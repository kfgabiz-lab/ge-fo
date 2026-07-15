import DevicesHelp from "../components/DevicesHelp";
import DevicesHero from "../components/DevicesHero";
import DevicesMarkets from "../components/DevicesMarkets";
import DevicesPageFooter from "../components/DevicesPageFooter";
import "@/assets/css/devices-systems.css";

export default function MotorControlPage() {
  return (
    <main className="devices-page" id="Page_devices_motor_control">
      <DevicesHero withProducts />
      <DevicesMarkets />
      <DevicesHelp variant="overlay" />
      <DevicesPageFooter />
    </main>
  );
}

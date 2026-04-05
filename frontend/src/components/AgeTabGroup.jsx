import { useNavigate } from "react-router";
import { Button } from "./Button";
import { useProfile } from "../context/ProfileContext";

export function AgeTabGroup({ activeMode }) {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  const isKidsProfile = (activeProfile?.level ?? 1) < 2;

  return (
    <div className="px-4 md:px-10 flex gap-2 md:gap-3.5 overflow-x-auto scrollbar-hide items-center">
      <Button
        variant="age-kids"
        active={activeMode === "kids"}
        onClick={activeMode !== "kids" ? () => navigate("/home") : undefined}
      >
        키즈 4~7세
      </Button>

      <Button
        variant="age-junior"
        active={activeMode === "junior"}
        onClick={isKidsProfile ? undefined : () => navigate("/junior")}
        className={isKidsProfile ? "cursor-not-allowed" : ""}
      >
        주니어 8~12세
      </Button>
    </div>
  );
}

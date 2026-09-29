import { useAppTheme } from "../../theme";
import "./Footer.css";

export default function Footer() {
  const { theme } = useAppTheme();

  return (
    <footer className="site-footer" data-theme={theme}>
      <div className="site-footer-inner">
        <p className="site-footer-copyright"><span>© 2026 ИТ Школа РТК ·</span>{" "}<span>ООО «Ростелеком Информационные Технологии»</span></p>
        <p>Версия 1.0.0</p>
      </div>
    </footer>
  );
}

import { useAppTheme } from "../../theme";
import "./Footer.css";

export default function Footer() {
  const { theme } = useAppTheme();

  return (
    <footer className="site-footer" data-theme={theme}>
      <div className="site-footer-inner">
        <p>© 2026 ИТ Школа РТК · ООО «Ростелеком Информационные Технологии»</p>
        <p>Версия 1.0.0</p>
      </div>
    </footer>
  );
}

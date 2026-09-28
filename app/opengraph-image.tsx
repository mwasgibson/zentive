import { ImageResponse } from "next/og";

export const alt =
  "Zentive — Direct-to-carrier bulk SMS for Kenyan businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(145deg, #F8F6F1 0%, #E8E4DC 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: "#141414" }}>
          Zentive
        </div>
        <div style={{ marginTop: 16, fontSize: 32, color: "#E2711D" }}>
          Direct-to-carrier bulk SMS
        </div>
        <div style={{ marginTop: 8, fontSize: 26, color: "#6B7280" }}>
          for Kenyan businesses
        </div>
      </div>
    ),
    { ...size },
  );
}

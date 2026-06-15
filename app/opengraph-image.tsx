import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Travelholics | Certified Cruise Specialist — Yolanda Harris";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#F5EFE4", // sand
          fontFamily: "Georgia, serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Coral accent bar — top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#E85D5D",
          }}
        />

        {/* Logo wordmark */}
        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: 700,
            color: "#1F2D86",
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}
        >
          Travelholics
        </div>

        {/* Divider */}
        <div
          style={{
            width: "80px",
            height: "3px",
            backgroundColor: "#E85D5D",
            borderRadius: "2px",
            marginBottom: "28px",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#1A2E2A",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
            marginBottom: "20px",
          }}
        >
          Certified Cruise Specialist
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#6B7B74",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          20+ years · every major line · same price as booking direct
        </div>

        {/* CTA pill */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#E85D5D",
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: 700,
            padding: "14px 36px",
            borderRadius: "9999px",
            letterSpacing: "0.02em",
          }}
        >
          Plan your cruise → yotravelholic.com
        </div>

        {/* Coral accent bar — bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: "#E85D5D",
            opacity: 0.4,
          }}
        />
      </div>
    ),
    { ...size }
  );
}

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Link,
} from "@react-email/components";

interface Props {
  name?: string;
  verifyUrl: string;
}

export default function VerifyEmail({ name = "bạn", verifyUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Xác minh tài khoản Hồng Anh</Preview>
      <Body style={{ backgroundColor: "#f3f4f6", fontFamily: "sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "6px",
          }}
        >
          <Heading>Chào {name},</Heading>
          <Text>
            Cảm ơn bạn đã đăng ký tại Hồng Anh. Vui lòng nhấn vào liên kết bên
            dưới để xác minh email của bạn:
          </Text>
          <Link
            href={verifyUrl}
            style={{
              display: "inline-block",
              padding: "10px 16px",
              backgroundColor: "#2563eb", // màu primary
              color: "#fff",
              borderRadius: "4px",
              textDecoration: "none",
              marginTop: "10px",
            }}
          >
            Xác minh email
          </Link>
          <Text style={{ marginTop: "32px", fontSize: "12px", color: "#888" }}>
            Nếu bạn không tạo tài khoản, hãy bỏ qua email này.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

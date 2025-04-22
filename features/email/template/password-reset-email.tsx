import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Link,
  Hr,
} from "@react-email/components";

type PasswordResetEmailProps = {
  name?: string;
  resetUrl: string;
};

export const PasswordResetEmail = ({
  name,
  resetUrl,
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            Đặt lại mật khẩu tài khoản Hồng Anh
          </Heading>

          <Text style={styles.text}>
            {name ? `Chào ${name},` : "Chào bạn,"}
          </Text>

          <Text style={styles.text}>
            Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Nhấn vào
            nút bên dưới để tạo mật khẩu mới.
          </Text>

          <Link href={resetUrl} style={styles.button}>
            Đặt lại mật khẩu
          </Link>

          <Text style={styles.text}>
            Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Liên
            kết này sẽ hết hạn trong vòng 15 phút.
          </Text>

          <Hr style={{ marginTop: "32px" }} />

          <Text style={{ textAlign: "center", ...styles.footer }}>
            © {new Date().getFullYear()} Hồng Anh. Mọi quyền được bảo lưu.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

const styles = {
  body: {
    backgroundColor: "#f9fafb",
    padding: "40px 0",
    fontFamily: "sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "32px",
    maxWidth: "480px",
    margin: "0 auto",
  },
  heading: {
    color: "#111827",
    fontSize: "20px",
    marginBottom: "24px",
  },
  text: {
    fontSize: "14px",
    color: "#374151",
    marginBottom: "16px",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#4f46e5", // primary
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: "bold",
  },
  footer: {
    fontSize: "12px",
    color: "#9ca3af",
    // textAlign: "center",
    marginTop: "16px",
  },
};

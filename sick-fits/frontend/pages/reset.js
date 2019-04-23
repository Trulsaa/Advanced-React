import Reset from "../components/Reset";

export default ({ query: { resetToken } }) => (
  <div>
    <p>Reset your password!</p>
    <Reset resetToken={resetToken} />
  </div>
);

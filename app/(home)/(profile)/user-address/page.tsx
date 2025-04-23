import { getSafeUserInfo } from "@/features/users/user.queries";
import ShippingAddressForm from "./user-address-form";

const UserAddressPage = async () => {
  const result = await getSafeUserInfo();
  if (!result.success) return null;

  let userAddress = result.data.shippingAddress;
  if (!userAddress) {
    userAddress = {
      address: "",
      ward: "",
      district: "",
      city: "",
    };
  }

  return (
    <div>
      <ShippingAddressForm
        initValues={{ ...userAddress, id: result.data.id }}
      />
    </div>
  );
};

export default UserAddressPage;

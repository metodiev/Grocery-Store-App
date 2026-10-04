import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  addAddressRequest,
  changePasswordRequest,
  getProfileRequest,
  removeAddressRequest,
  updateProfileRequest
} from "../services/userService";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [newAddress, setNewAddress] = useState({ fullName: "", phone: "", line1: "", city: "", postalCode: "", instructions: "" });

  const fetchProfile = async () => {
    const data = await getProfileRequest();
    setProfile(data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchProfile();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  const onProfileUpdate = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    await updateProfileRequest({
      name: form.get("name"),
      phone: form.get("phone")
    });
    toast.success("Profile updated");
    await fetchProfile();
  };

  const onPasswordChange = async (event) => {
    event.preventDefault();
    await changePasswordRequest(passwordForm);
    setPasswordForm({ currentPassword: "", newPassword: "" });
    toast.success("Password changed");
  };

  const onAddAddress = async (event) => {
    event.preventDefault();
    await addAddressRequest(newAddress);
    setNewAddress({ fullName: "", phone: "", line1: "", city: "", postalCode: "", instructions: "" });
    toast.success("Address saved");
    await fetchProfile();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form className="card space-y-4 p-6" onSubmit={onProfileUpdate}>
        <h2 className="text-xl font-bold text-slate-800">Profile</h2>
        <input className="input" defaultValue={profile.name} name="name" required />
        <input className="input" defaultValue={profile.email} disabled />
        <input className="input" defaultValue={profile.phone || ""} name="phone" />
        <button className="btn-primary" type="submit">
          Save profile
        </button>
      </form>

      <form className="card space-y-4 p-6" onSubmit={onPasswordChange}>
        <h2 className="text-xl font-bold text-slate-800">Change password</h2>
        <input
          className="input"
          placeholder="Current password"
          required
          type="password"
          value={passwordForm.currentPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
        />
        <input
          className="input"
          minLength={8}
          placeholder="New password"
          required
          type="password"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
        />
        <button className="btn-primary" type="submit">
          Update password
        </button>
      </form>

      <div className="card space-y-4 p-6 lg:col-span-2">
        <h2 className="text-xl font-bold text-slate-800">Addresses</h2>
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={onAddAddress}>
          <input className="input" placeholder="Full name" required value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
          <input className="input" placeholder="Phone" required value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
          <input className="input sm:col-span-2" placeholder="Address" required value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
          <input className="input" placeholder="City" required value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
          <input className="input" placeholder="Postal code" required value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
          <input className="input sm:col-span-2" placeholder="Instructions" value={newAddress.instructions} onChange={(e) => setNewAddress({ ...newAddress, instructions: e.target.value })} />
          <button className="btn-primary sm:col-span-2" type="submit">
            Add address
          </button>
        </form>

        <div className="space-y-3">
          {profile.addresses?.map((address) => (
            <div className="rounded-xl border border-slate-200 p-4" key={address.id}>
              <p className="font-semibold text-slate-800">{address.fullName}</p>
              <p className="text-sm text-slate-600">{address.line1}, {address.city}, {address.postalCode}</p>
              <button className="mt-2 text-sm font-semibold text-red-600" onClick={() => removeAddressRequest(address.id).then(fetchProfile)} type="button">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

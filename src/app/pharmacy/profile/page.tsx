"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import {
  addDeliveryAddress,
  createDocumentRecord,
  getPharmacyProfile,
  markPasswordUpdateReady,
  removeDeliveryAddress,
  saveBusinessDetails,
  saveContactDetails,
  saveDocuments,
  savePrimaryAddress,
  saveRegulatoryDetails,
  validateProfilePassword,
  type PharmacyProfile,
} from "@/lib/pharmacy-profile";

const documentTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ProfilePage() {
  const [profile, setProfile] = useState<PharmacyProfile>(
    getPharmacyProfile(),
  );
  const [message, setMessage] = useState("");

  const [addressLabel, setAddressLabel] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressPin, setAddressPin] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const update = (
    nextProfile: PharmacyProfile,
    successMessage: string,
  ) => {
    setProfile(nextProfile);
    setMessage(successMessage);
  };

  const saveBusiness = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile.businessName.trim()) {
      setMessage("Business name is required.");
      return;
    }

    update(
      saveBusinessDetails({
        businessName: profile.businessName.trim(),
        businessType: profile.businessType.trim(),
        ownerName: profile.ownerName.trim(),
      }),
      "Business details saved.",
    );
  };

  const saveRegulatory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile.drugLicenceNumber.trim()) {
      setMessage("Drug licence number is required.");
      return;
    }

    if (!profile.licenceExpiry) {
      setMessage("Licence expiry date is required.");
      return;
    }

    if (!profile.gstNumber.trim()) {
      setMessage("GST number is required.");
      return;
    }

    if (!profile.pan.trim()) {
      setMessage("PAN is required.");
      return;
    }

    update(
      saveRegulatoryDetails({
        drugLicenceNumber: profile.drugLicenceNumber.trim(),
        licenceExpiry: profile.licenceExpiry,
        gstNumber: profile.gstNumber.trim(),
        pan: profile.pan.trim(),
      }),
      "Regulatory details saved.",
    );
  };

  const saveContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile.contactPerson.trim()) {
      setMessage("Contact person is required.");
      return;
    }

    if (!profile.phone.trim()) {
      setMessage("Phone number is required.");
      return;
    }

    if (!profile.email.includes("@")) {
      setMessage("A valid email address is required.");
      return;
    }

    update(
      saveContactDetails({
        contactPerson: profile.contactPerson.trim(),
        phone: profile.phone.trim(),
        email: profile.email.trim(),
      }),
      "Contact details saved.",
    );
  };

  const saveAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile.businessAddress.trim()) {
      setMessage("Address is required.");
      return;
    }

    if (!profile.city.trim() || !profile.state.trim()) {
      setMessage("City and state are required.");
      return;
    }

    if (!/^\d{6}$/.test(profile.pin)) {
      setMessage("PIN code must contain 6 digits.");
      return;
    }

    update(
      savePrimaryAddress({
        businessAddress: profile.businessAddress.trim(),
        city: profile.city.trim(),
        state: profile.state.trim(),
        pin: profile.pin,
      }),
      "Primary address saved.",
    );
  };

  const addAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !addressLabel.trim() ||
      !addressValue.trim() ||
      !addressCity.trim() ||
      !addressState.trim()
    ) {
      setMessage("Complete all delivery address fields.");
      return;
    }

    if (!/^\d{6}$/.test(addressPin)) {
      setMessage("Delivery PIN code must contain 6 digits.");
      return;
    }

    addDeliveryAddress({
      label: addressLabel.trim(),
      address: addressValue.trim(),
      city: addressCity.trim(),
      state: addressState.trim(),
      pin: addressPin,
      isDefault: false,
    });

    setProfile(getPharmacyProfile());
    setAddressLabel("");
    setAddressValue("");
    setAddressCity("");
    setAddressState("");
    setAddressPin("");
    setMessage("Warehouse address added.");
  };

  const uploadDocument = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!documentTypes.includes(file.type)) {
      setMessage(
        "Only PDF, JPG, and PNG documents are allowed.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage("Document size must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    const document = createDocumentRecord(file);

    update(
      saveDocuments([...profile.documents, document]),
      `${file.name} uploaded and marked for review.`,
    );

    event.target.value = "";
  };

  const updatePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validateProfilePassword(
      currentPassword,
      newPassword,
      confirmPassword,
    );

    if (error) {
      setMessage(error);
      return;
    }

    setMessage(markPasswordUpdateReady());
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const removeAddress = (id: string) => {
    const next = removeDeliveryAddress(id);
    update(next, "Delivery address removed.");
  };

  const removeDocument = (id: string) => {
    const next = saveDocuments(
      profile.documents.filter(
        (document) => document.id !== id,
      ),
    );

    update(next, "Document removed.");
  };

  return (
    <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Pharmacy Partner Portal
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Pharmacy Profile
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Manage business, regulatory, contact, delivery,
            document, and security information.
          </p>
        </div>

        {message && (
          <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-700">
            {message}
          </div>
        )}

        <div className="mt-6 space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">
              Business Details
            </h2>

            <form
              onSubmit={saveBusiness}
              className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3"
            >
              <div>
                <label
                  htmlFor="business-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Business Name
                </label>
                <input
                  id="business-name"
                  value={profile.businessName}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      businessName: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="business-type"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Business Type
                </label>
                <select
                  id="business-type"
                  value={profile.businessType}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      businessType: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
                >
                  <option>Pharmacy</option>
                  <option>Medical Store</option>
                  <option>Healthcare Business</option>
                  <option>Hospital / Clinic</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="owner-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Owner / Authorized Person
                </label>
                <input
                  id="owner-name"
                  value={profile.ownerName}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      ownerName: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-fit rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Save Business Details
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">
              Regulatory Information
            </h2>

            <form
              onSubmit={saveRegulatory}
              className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="drug-licence"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Drug Licence Number
                </label>
                <input
                  id="drug-licence"
                  value={profile.drugLicenceNumber}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      drugLicenceNumber: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="licence-expiry"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Licence Expiry
                </label>
                <input
                  id="licence-expiry"
                  type="date"
                  value={profile.licenceExpiry}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      licenceExpiry: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="gst-number"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  GST Number
                </label>
                <input
                  id="gst-number"
                  value={profile.gstNumber}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      gstNumber: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="pan-number"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  PAN / Business Identification
                </label>
                <input
                  id="pan-number"
                  value={profile.pan}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      pan: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-fit rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Save Regulatory Details
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">
              Contact Information
            </h2>

            <form
              onSubmit={saveContact}
              className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3"
            >
              <div>
                <label
                  htmlFor="contact-person"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Contact Person
                </label>
                <input
                  id="contact-person"
                  value={profile.contactPerson}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      contactPerson: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Phone
                </label>
                <input
                  id="contact-phone"
                  value={profile.phone}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      phone: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={profile.email}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      email: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-fit rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Save Contact Information
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">
              Delivery Addresses
            </h2>

            <form
              onSubmit={saveAddress}
              className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <label
                  htmlFor="primary-address"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Primary Address
                </label>
                <input
                  id="primary-address"
                  value={profile.businessAddress}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      businessAddress: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="primary-city"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  City
                </label>
                <input
                  id="primary-city"
                  value={profile.city}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      city: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="primary-state"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  State
                </label>
                <input
                  id="primary-state"
                  value={profile.state}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      state: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="primary-pin"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  PIN Code
                </label>
                <input
                  id="primary-pin"
                  inputMode="numeric"
                  maxLength={6}
                  value={profile.pin}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      pin: event.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-fit self-end rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Save Primary Address
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {profile.addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {address.label}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.address}, {address.city},{" "}
                      {address.state} - {address.pin}
                    </p>
                  </div>

                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => removeAddress(address.id)}
                      className="w-fit rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={addAddress}
              className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 md:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="address-label"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Address Label
                </label>
                <input
                  id="address-label"
                  value={addressLabel}
                  onChange={(event) =>
                    setAddressLabel(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="address-value"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Address
                </label>
                <input
                  id="address-value"
                  value={addressValue}
                  onChange={(event) =>
                    setAddressValue(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="address-city"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Delivery City
                </label>
                <input
                  id="address-city"
                  value={addressCity}
                  onChange={(event) =>
                    setAddressCity(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="address-state"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Delivery State
                </label>
                <input
                  id="address-state"
                  value={addressState}
                  onChange={(event) =>
                    setAddressState(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="address-pin"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Delivery PIN Code
                </label>
                <input
                  id="address-pin"
                  inputMode="numeric"
                  maxLength={6}
                  value={addressPin}
                  onChange={(event) =>
                    setAddressPin(
                      event.target.value.replace(/\D/g, ""),
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-fit self-end rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800"
              >
                Add Delivery Address
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">
              Documents
            </h2>

            <div className="mt-5">
              <label
                htmlFor="profile-document"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Upload Document
              </label>

              <input
                id="profile-document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={uploadDocument}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
              />

              <p className="mt-2 text-xs text-gray-500">
                PDF, JPG, or PNG. Maximum size: 5 MB.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {profile.documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {document.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {document.status.replace("_", " ")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeDocument(document.id)
                    }
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">
              Password / Security
            </h2>

            <form
              onSubmit={updatePassword}
              className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3"
            >
              <div>
                <label
                  htmlFor="current-password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-fit rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Update Password
              </button>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}
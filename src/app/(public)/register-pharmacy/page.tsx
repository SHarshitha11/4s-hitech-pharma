"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge, Button, Card } from "@/components/ui";

const STORAGE_KEY = "4s-hitech-pharma-registration";

type Step = 1 | 2 | 3 | 4 | 5;

type RegistrationData = {
  businessName: string;
  businessType: string;
  ownerName: string;
  contactPerson: string;
  phone: string;
  email: string;
  drugLicenceNumber: string;
  licenceExpiry: string;
  gstNumber: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  drugLicenceDocument: string[];
  gstCertificateDocument: string[];
  panDocument: string[];
  otherDocuments: string[];
};

const initialData: RegistrationData = {
  businessName: "",
  businessType: "",
  ownerName: "",
  contactPerson: "",
  phone: "",
  email: "",
  drugLicenceNumber: "",
  licenceExpiry: "",
  gstNumber: "",
  pan: "",
  address: "",
  city: "",
  state: "",
  pin: "",
  drugLicenceDocument: [],
  gstCertificateDocument: [],
  panDocument: [],
  otherDocuments: [],
};

const steps = [
  {
    number: 1,
    title: "Business",
    description: "Business and contact details",
  },
  {
    number: 2,
    title: "Regulatory",
    description: "Regulatory information",
  },
  {
    number: 3,
    title: "Address",
    description: "Pharmacy address",
  },
  {
    number: 4,
    title: "Documents",
    description: "Required documents",
  },
  {
    number: 5,
    title: "Review",
    description: "Review and submit",
  },
] as const;

type ErrorMap = Partial<Record<keyof RegistrationData, string>>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^[6-9]\d{9}$/.test(value);
}

function isValidPin(value: string) {
  return /^\d{6}$/.test(value);
}

function isValidPan(value: string) {
  return /^[A-Z]{5}\d{4}[A-Z]$/.test(value.toUpperCase());
}

function isValidGst(value: string) {
  return /^[0-9A-Z]{15}$/.test(value.toUpperCase());
}

function validateStep(step: Step, data: RegistrationData): ErrorMap {
  const errors: ErrorMap = {};

  if (step === 1) {
    if (!data.businessName.trim()) {
      errors.businessName = "Business name is required.";
    }

    if (!data.businessType.trim()) {
      errors.businessType = "Business type is required.";
    }

    if (!data.ownerName.trim()) {
      errors.ownerName = "Owner name is required.";
    }

    if (!data.contactPerson.trim()) {
      errors.contactPerson = "Contact person is required.";
    }

    if (!data.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!isValidPhone(data.phone.trim())) {
      errors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (!data.email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(data.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
  }

  if (step === 2) {
    if (!data.drugLicenceNumber.trim()) {
      errors.drugLicenceNumber = "Drug licence number is required.";
    }

    if (!data.licenceExpiry) {
      errors.licenceExpiry = "Licence expiry date is required.";
    } else {
      const expiryDate = new Date(`${data.licenceExpiry}T23:59:59`);

      if (Number.isNaN(expiryDate.getTime())) {
        errors.licenceExpiry = "Enter a valid licence expiry date.";
      } else if (expiryDate < new Date()) {
        errors.licenceExpiry = "Licence expiry date must be in the future.";
      }
    }

    if (!data.gstNumber.trim()) {
      errors.gstNumber = "GST number is required.";
    } else if (!isValidGst(data.gstNumber.trim())) {
      errors.gstNumber =
        "GST number must contain 15 uppercase letters and numbers.";
    }

    if (!data.pan.trim()) {
      errors.pan = "PAN is required.";
    } else if (!isValidPan(data.pan.trim())) {
      errors.pan = "Enter a valid PAN number.";
    }
  }

  if (step === 3) {
    if (!data.address.trim()) {
      errors.address = "Address is required.";
    }

    if (!data.city.trim()) {
      errors.city = "City is required.";
    }

    if (!data.state.trim()) {
      errors.state = "State is required.";
    }

    if (!data.pin.trim()) {
      errors.pin = "PIN code is required.";
    } else if (!isValidPin(data.pin.trim())) {
      errors.pin = "PIN code must contain 6 digits.";
    }
  }

  if (step === 4) {
    if (data.drugLicenceDocument.length === 0) {
      errors.drugLicenceDocument = "Drug licence document is required.";
    }

    if (data.gstCertificateDocument.length === 0) {
      errors.gstCertificateDocument = "GST certificate is required.";
    }

    if (data.panDocument.length === 0) {
      errors.panDocument = "PAN document is required.";
    }
  }

  return errors;
}

function getInputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
      : "border-gray-300 focus:border-gray-500 focus:ring-gray-200"
  }`;
}

export default function RegisterPharmacyPage() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<RegistrationData>(initialData);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);

        if (saved) {
          setData({
            ...initialData,
            ...JSON.parse(saved),
          });
        }
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || submitted) {
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated, submitted]);

  const updateField = <K extends keyof RegistrationData>(
    field: K,
    value: RegistrationData[K],
  ) => {
    setData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const handleDocumentChange = (
    field:
      | "drugLicenceDocument"
      | "gstCertificateDocument"
      | "panDocument"
      | "otherDocuments",
    files: FileList | null,
  ) => {
    if (!files) {
      return;
    }

    const names = Array.from(files).map((file) => file.name);

    updateField(field, names);
  };

  const currentErrors = useMemo(
    () => validateStep(step, data),
    [step, data],
  );

  const goNext = () => {
    const validationErrors = validateStep(step, data);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStep((previous) => Math.min(5, previous + 1) as Step);
  };

  const goBack = () => {
    setErrors({});
    setStep((previous) => Math.max(1, previous - 1) as Step);
  };

  const handleSubmit = () => {
    const allErrors: ErrorMap = {
      ...validateStep(1, data),
      ...validateStep(2, data),
      ...validateStep(3, data),
      ...validateStep(4, data),
    };

    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      return;
    }

    sessionStorage.removeItem(STORAGE_KEY);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-w-0 overflow-x-hidden bg-gray-50 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto w-full max-w-3xl">
          <Card
            title="Registration Submitted"
            description="Your pharmacy registration has been received."
          >
            <div className="space-y-6">
              <Badge variant="success">Pending Verification</Badge>

              <p className="leading-7 text-gray-600">
                Thank you for registering with 4S HITECH PHARMA. Your
                registration is now pending verification and administrative
                review.
              </p>

              <Button
                onClick={() => {
                  setData(initialData);
                  setStep(1);
                  setErrors({});
                  setSubmitted(false);
                }}
              >
                Submit Another Registration
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 overflow-x-hidden bg-gray-50 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <section>
          <Badge>Pharmacy Registration</Badge>

          <h1 className="mt-4 break-words text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Register Your Pharmacy
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-gray-600">
            Complete the registration form to request access to the
            pharmacy ordering platform.
          </p>
        </section>

        <Card>
          <div className="grid gap-3 sm:grid-cols-5">
            {steps.map((item) => {
              const active = step === item.number;
              const completed = step > item.number;

              return (
                <button
                  key={item.number}
                  type="button"
                  onClick={() => {
                    if (item.number < step) {
                      setErrors({});
                      setStep(item.number as Step);
                    }
                  }}
                  disabled={item.number > step}
                  className={`rounded-lg border p-3 text-left transition ${
                    active
                      ? "border-gray-900 bg-gray-900 text-white"
                      : completed
                        ? "border-gray-300 bg-white text-gray-900"
                        : "border-gray-200 bg-gray-50 text-gray-400"
                  }`}
                >
                  <div className="text-xs font-semibold">
                    Step {item.number}
                  </div>

                  <div className="mt-1 text-sm font-semibold">
                    {item.title}
                  </div>

                  <div
                    className={`mt-1 text-xs ${
                      active ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {Object.keys(currentErrors).length > 0 && (
          <Card
            title="Please check the highlighted fields"
            description="Complete all required fields before continuing."
          >
            <div className="text-sm text-red-600">
              {Object.values(currentErrors).map((message) => (
                <p key={message}>{message}</p>
              ))}
            </div>
          </Card>
        )}

        {step === 1 && (
          <Card
            title="Step 1 - Business Details"
            description="Provide the basic business and contact information."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="businessName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Business Name *
                </label>

                <input
                  id="businessName"
                  value={data.businessName}
                  onChange={(event) =>
                    updateField("businessName", event.target.value)
                  }
                  className={getInputClass(Boolean(errors.businessName))}
                />

                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.businessName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="businessType"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Business Type *
                </label>

                <select
                  id="businessType"
                  value={data.businessType}
                  onChange={(event) =>
                    updateField("businessType", event.target.value)
                  }
                  className={getInputClass(Boolean(errors.businessType))}
                >
                  <option value="">Select business type</option>
                  <option value="Retail Pharmacy">Retail Pharmacy</option>
                  <option value="Medical Store">Medical Store</option>
                  <option value="Hospital Pharmacy">
                    Hospital Pharmacy
                  </option>
                  <option value="Clinic">Clinic</option>
                  <option value="Healthcare Institution">
                    Healthcare Institution
                  </option>
                  <option value="Other Eligible Business">
                    Other Eligible Business
                  </option>
                </select>

                {errors.businessType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.businessType}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="ownerName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Owner Name *
                </label>

                <input
                  id="ownerName"
                  value={data.ownerName}
                  onChange={(event) =>
                    updateField("ownerName", event.target.value)
                  }
                  className={getInputClass(Boolean(errors.ownerName))}
                />

                {errors.ownerName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.ownerName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contactPerson"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contact Person *
                </label>

                <input
                  id="contactPerson"
                  value={data.contactPerson}
                  onChange={(event) =>
                    updateField("contactPerson", event.target.value)
                  }
                  className={getInputClass(Boolean(errors.contactPerson))}
                />

                {errors.contactPerson && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactPerson}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone *
                </label>

                <input
                  id="phone"
                  inputMode="numeric"
                  maxLength={10}
                  value={data.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value.replace(/\D/g, ""),
                    )
                  }
                  className={getInputClass(Boolean(errors.phone))}
                />

                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email *
                </label>

                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  className={getInputClass(Boolean(errors.email))}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card
            title="Step 2 - Regulatory Details"
            description="Provide the pharmacy's regulatory information."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="drugLicenceNumber"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Drug Licence Number *
                </label>

                <input
                  id="drugLicenceNumber"
                  value={data.drugLicenceNumber}
                  onChange={(event) =>
                    updateField("drugLicenceNumber", event.target.value)
                  }
                  className={getInputClass(
                    Boolean(errors.drugLicenceNumber),
                  )}
                />

                {errors.drugLicenceNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.drugLicenceNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="licenceExpiry"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Licence Expiry *
                </label>

                <input
                  id="licenceExpiry"
                  type="date"
                  value={data.licenceExpiry}
                  onChange={(event) =>
                    updateField("licenceExpiry", event.target.value)
                  }
                  className={getInputClass(
                    Boolean(errors.licenceExpiry),
                  )}
                />

                {errors.licenceExpiry && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.licenceExpiry}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gstNumber"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  GST Number *
                </label>

                <input
                  id="gstNumber"
                  value={data.gstNumber}
                  maxLength={15}
                  onChange={(event) =>
                    updateField(
                      "gstNumber",
                      event.target.value.toUpperCase(),
                    )
                  }
                  className={getInputClass(Boolean(errors.gstNumber))}
                />

                {errors.gstNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.gstNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="pan"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  PAN *
                </label>

                <input
                  id="pan"
                  value={data.pan}
                  maxLength={10}
                  onChange={(event) =>
                    updateField("pan", event.target.value.toUpperCase())
                  }
                  className={getInputClass(Boolean(errors.pan))}
                />

                {errors.pan && (
                  <p className="mt-1 text-sm text-red-600">{errors.pan}</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card
            title="Step 3 - Address"
            description="Enter the pharmacy's registered address."
          >
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Address *
                </label>

                <textarea
                  id="address"
                  rows={4}
                  value={data.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  className={getInputClass(Boolean(errors.address))}
                />

                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    City *
                  </label>

                  <input
                    id="city"
                    value={data.city}
                    onChange={(event) =>
                      updateField("city", event.target.value)
                    }
                    className={getInputClass(Boolean(errors.city))}
                  />

                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    State *
                  </label>

                  <input
                    id="state"
                    value={data.state}
                    onChange={(event) =>
                      updateField("state", event.target.value)
                    }
                    className={getInputClass(Boolean(errors.state))}
                  />

                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pin"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    PIN *
                  </label>

                  <input
                    id="pin"
                    inputMode="numeric"
                    maxLength={6}
                    value={data.pin}
                    onChange={(event) =>
                      updateField(
                        "pin",
                        event.target.value.replace(/\D/g, ""),
                      )
                    }
                    className={getInputClass(Boolean(errors.pin))}
                  />

                  {errors.pin && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pin}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {step === 4 && (
          <Card
            title="Step 4 - Documents"
            description="Upload the required registration documents."
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="drugLicenceDocument"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Drug Licence *
                </label>

                <input
                  id="drugLicenceDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    handleDocumentChange(
                      "drugLicenceDocument",
                      event.target.files,
                    )
                  }
                  className="block w-full text-sm text-gray-700"
                />

                {data.drugLicenceDocument.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {data.drugLicenceDocument.join(", ")}
                  </p>
                )}

                {errors.drugLicenceDocument && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.drugLicenceDocument}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gstCertificateDocument"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  GST Certificate *
                </label>

                <input
                  id="gstCertificateDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    handleDocumentChange(
                      "gstCertificateDocument",
                      event.target.files,
                    )
                  }
                  className="block w-full text-sm text-gray-700"
                />

                {data.gstCertificateDocument.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {data.gstCertificateDocument.join(", ")}
                  </p>
                )}

                {errors.gstCertificateDocument && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.gstCertificateDocument}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="panDocument"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  PAN Document *
                </label>

                <input
                  id="panDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    handleDocumentChange(
                      "panDocument",
                      event.target.files,
                    )
                  }
                  className="block w-full text-sm text-gray-700"
                />

                {data.panDocument.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {data.panDocument.join(", ")}
                  </p>
                )}

                {errors.panDocument && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.panDocument}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="otherDocuments"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Other Documents
                </label>

                <input
                  id="otherDocuments"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    handleDocumentChange(
                      "otherDocuments",
                      event.target.files,
                    )
                  }
                  className="block w-full text-sm text-gray-700"
                />

                {data.otherDocuments.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {data.otherDocuments.join(", ")}
                  </p>
                )}
              </div>

              <p className="text-xs leading-5 text-gray-500">
                Accepted formats: PDF, JPG, JPEG and PNG.
              </p>
            </div>
          </Card>
        )}

        {step === 5 && (
          <Card
            title="Step 5 - Review & Submit"
            description="Review the information before submitting your pharmacy registration."
          >
            <div className="space-y-8">
              <section>
                <h2 className="text-base font-semibold text-gray-900">
                  Business Details
                </h2>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-gray-500">Business Name</dt>
                    <dd className="mt-1 break-words text-sm text-gray-900">
                      {data.businessName}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-gray-500">Business Type</dt>
                    <dd className="mt-1 break-words text-sm text-gray-900">
                      {data.businessType}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-gray-500">Owner Name</dt>
                    <dd className="mt-1 break-words text-sm text-gray-900">
                      {data.ownerName}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-gray-500">
                      Contact Person
                    </dt>
                    <dd className="mt-1 break-words text-sm text-gray-900">
                      {data.contactPerson}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-gray-500">Phone</dt>
                    <dd className="mt-1 break-words text-sm text-gray-900">
                      {data.phone}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd className="mt-1 break-words text-sm text-gray-900">
                      {data.email}
                    </dd>
                  </div>
                </dl>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900">
                  Regulatory Details
                </h2>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-gray-500">
                      Drug Licence Number
                    </dt>
                    <dd className="mt-1 break-words text-sm text-gray-900">
                      {data.drugLicenceNumber}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-gray-500">
                      Licence Expiry
                    </dt>
                    <dd className="mt-1 break-words text-sm text-gray-900">
                      {data.licenceExpiry}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-gray-500">GST Number</dt>
                    <dd className="mt-1 break-words text-sm text-gray-900">
                      {data.gstNumber}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-gray-500">PAN</dt>
                    <dd className="mt-1 break-words text-sm text-gray-900">
                      {data.pan}
                    </dd>
                  </div>
                </dl>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900">
                  Address
                </h2>

                <p className="mt-4 break-words text-sm leading-6 text-gray-700">
                  {data.address}
                  <br />
                  {data.city}, {data.state} - {data.pin}
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900">
                  Documents
                </h2>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Drug Licence</dt>
                    <dd className="mt-1 break-words text-gray-900">
                      {data.drugLicenceDocument.join(", ")}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-gray-500">GST Certificate</dt>
                    <dd className="mt-1 break-words text-gray-900">
                      {data.gstCertificateDocument.join(", ")}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-gray-500">PAN Document</dt>
                    <dd className="mt-1 break-words text-gray-900">
                      {data.panDocument.join(", ")}
                    </dd>
                  </div>

                  {data.otherDocuments.length > 0 && (
                    <div>
                      <dt className="text-gray-500">Other Documents</dt>
                      <dd className="mt-1 break-words text-gray-900">
                        {data.otherDocuments.join(", ")}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm leading-6 text-gray-600">
                  After submission, the registration will be placed in
                  pending verification for administrative review.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={goBack}>
                Back
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {step < 5 ? (
              <Button onClick={goNext}>Save & Continue</Button>
            ) : (
              <Button onClick={handleSubmit}>Submit Registration</Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

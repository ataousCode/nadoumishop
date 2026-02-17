import { useState, useEffect } from "react";
import { NadoumiButton } from "../../../components/shared/NadoumiButton";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import type { CreateAddressDto, Address } from "../../../types/address";

interface AddressFormProps {
  initialData?: Address;
  onSubmit: (data: CreateAddressDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AddressForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: AddressFormProps) => {
  const [formData, setFormData] = useState<CreateAddressDto>({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "Algeria",
    isDefault: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        street: initialData.street,
        city: initialData.city,
        state: initialData.state,
        zip: initialData.zip,
        country: initialData.country,
        isDefault: initialData.isDefault,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="e.g., 123 Rue de la Liberté"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., Alger"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State / Province</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g., Alger"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zip">ZIP / Postal Code</Label>
          <Input
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            placeholder="e.g., 16000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g., Algeria"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 py-2">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label
          htmlFor="isDefault"
          className="text-sm font-normal cursor-pointer"
        >
          Make this my default address
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <NadoumiButton
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </NadoumiButton>
        <NadoumiButton type="submit" isLoading={isLoading}>
          {initialData ? "Update Address" : "Add Address"}
        </NadoumiButton>
      </div>
    </form>
  );
};

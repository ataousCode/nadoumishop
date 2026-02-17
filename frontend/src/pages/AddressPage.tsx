import { useEffect, useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { NadoumiCard } from "../components/shared/NadoumiCard";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../features/address/addressSlice";
import { AddressForm } from "../features/address/components/AddressForm";
import type { Address, CreateAddressDto } from "../types/address";

const AddressPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, isLoading, error } = useSelector(
    (state: RootState) => state.address,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  const handleCreateOrUpdate = async (formData: CreateAddressDto) => {
    if (editingAddress) {
      await dispatch(updateAddress({ id: editingAddress.id, data: formData }));
    } else {
      await dispatch(createAddress(formData));
    }
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  const handleSetDefault = (address: Address) => {
    dispatch(updateAddress({ id: address.id, data: { isDefault: true } }));
  };

  return (
    <div className="bg-white min-h-screen py-8 relative">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link
            to="/dashboard"
            className="hover:text-orange-700 hover:underline"
          >
            Dashboard
          </Link>
          <span className="text-gray-300">&gt;</span>
          <span className="text-orange-700">Your Addresses</span>
        </div>

        <h1 className="text-3xl font-normal mb-8">Your Addresses</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Address Card */}
          <div
            onClick={() => {
              setEditingAddress(null);
              setIsFormOpen(true);
            }}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 min-h-[250px] transition-colors"
          >
            <Plus className="h-10 w-10 text-gray-400 mb-2" />
            <h3 className="text-xl font-bold text-gray-600">Add Address</h3>
          </div>

          {/* Loading State */}
          {isLoading && !isFormOpen && (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          )}

          {/* Existing Address Cards */}
          {addresses.map((address) => (
            <NadoumiCard
              key={address.id}
              className="p-6 border border-gray-200 rounded-lg relative min-h-[250px] flex flex-col shadow-none"
            >
              {address.isDefault && (
                <div className="text-xs text-gray-500 border-b border-gray-200 pb-2 mb-4">
                  Default: Nadoumi
                </div>
              )}
              <div className="flex-1 space-y-1 text-sm font-medium">
                <p className="font-bold">{user?.name || "User"}</p>
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
                <p>{address.country}</p>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-[#007185]">
                <button
                  onClick={() => handleEdit(address)}
                  className="hover:underline hover:text-[#c7511f]"
                >
                  Edit
                </button>
                <div className="w-[1px] h-4 bg-gray-300"></div>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="hover:underline hover:text-[#c7511f]"
                >
                  Remove
                </button>
                <div className="w-[1px] h-4 bg-gray-300"></div>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address)}
                    className="hover:underline hover:text-[#c7511f]"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </NadoumiCard>
          ))}
        </div>
      </div>

      {/* Address Form Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingAddress ? "Edit Address" : "Add a new address"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <AddressForm
                initialData={editingAddress || undefined}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => setIsFormOpen(false)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPage;

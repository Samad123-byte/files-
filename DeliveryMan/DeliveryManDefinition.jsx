import React, { useEffect, useState, useRef } from "react";
import {
  Input,
  InputComment,
  SaveUpdateBtn,
  ConfirmationPopup,
  apiService,
} from "nimbus-kit";
import { toast } from "react-toastify";
import { deliveryManModel } from "../../../Models/DeliveryManModel";
import DropDown from "../../Controls/DropDown/Dropdown";

export default function DeliveryManDefinition({
  mode,
  setMode,
  selectedRecord,
  setSelectedRecord,
  records,
  setRecords,
  apiUrl,
  setIsRecordTab,
  userRights,
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");
  const [store, setStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [actionState, setActionState] = useState("");

  const nameRef = useRef(null);

  const focusFirstInput = () => {
    nameRef.current?.focus();
  };

  useEffect(() => {
    if (mode === "new") {
      setName("");
      setMobile("");
      setDescription("");
      setStore(null);
    }
    focusFirstInput();
  }, [mode]);

  useEffect(() => {
    if (mode === "update" && selectedRecord) {
      setName(selectedRecord.firstName || "");
      setMobile(selectedRecord.mobile1 || "");
      setDescription(selectedRecord.description || "");
      setStore(
        selectedRecord.shopId && selectedRecord.shopId !== "0"
          ? { value: selectedRecord.shopId, label: `Store ${selectedRecord.shopId}` }
          : null
      );
    }
  }, [mode, selectedRecord]);

  const validate = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      focusFirstInput();
      return false;
    }
    if (!mobile.trim()) {
      toast.error("Mobile No is required");
      return false;
    }
    if (!/^[0-9]+$/.test(mobile.trim())) {
      toast.error("Mobile No must contain only numbers");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    setModalBody("Do you want to Save this record?");
    setModalTitle("Saving..!");
    setActionState("Save");
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!validate()) return;
    setModalBody("Do you want to Update this record?");
    setModalTitle("Updating..!");
    setActionState("Update");
    setShowModal(true);
  };

  const handleDelete = () => {
    setModalBody("Do you want to Delete this record?");
    setModalTitle("Deleting..!");
    setActionState("Delete");
    setShowModal(true);
  };

  const handleReset = () => {
    if (mode === "new") {
      setName("");
      setMobile("");
      setDescription("");
      setStore(null);
    } else if (selectedRecord) {
      setName(selectedRecord.firstName || selectedRecord.name || "");
      setMobile(selectedRecord.mobile1 || selectedRecord.mobile || "");
      setDescription(selectedRecord.description || "");
      setStore(
        selectedRecord.shopId
          ? { value: selectedRecord.shopId, label: `Store ${selectedRecord.shopId}` }
          : null
      );
    }
  };

  const onConfirm = () => {
    if (actionState === "Save") addRecord();
    else if (actionState === "Update") updateRecord();
    else if (actionState === "Delete") deleteRecord();
  };

  const addRecord = () => {
    const payload = {
      ...deliveryManModel,
      firstName: name.trim(),
      mobile1: mobile.trim(),
      description: description.trim(),
      shopId: store?.value || 0,
    };

    apiService({
      endpoint: apiUrl + "/DeliveryMan/add",
      method: "POST",
      data: payload,
    })
      .then((res) => {
        if (res.data.success) {
          const newRecord = {
            deliveryManId: res.data.data.deliveryManId,
            companyId: payload.companyId || 0,
            store: store?.label || "",
            storeId: store?.value || 0,
            name: name.trim(),
            mobile: mobile.trim(),
            description: description.trim(),
            readOnly: 0,
            sortOrder: 0,
            totalRecordCount: records.length + 1,
          };
          setSelectedRecord(newRecord);
          setRecords((prev) => [newRecord, ...prev]);
          setMode("update");
          toast.success(res.data.message || "Record added successfully");
        } else {
          toast.error(res.data.error || "Failed to add record");
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };

  const updateRecord = () => {
    const payload = {
      deliveryManId: selectedRecord.deliveryManId,
      firstName: name.trim(),
      mobile1: mobile.trim(),
      description: description.trim(),
      shopId: store?.value || 0,
    };

    apiService({
      endpoint: apiUrl + "/DeliveryMan/update",
      method: "POST",
      data: payload,
    })
      .then((res) => {
        if (res.data.success) {
          const updatedRecord = {
            ...selectedRecord,
            firstName: name.trim(),
            lastName: selectedRecord.lastName || "",
            name: name.trim() + (selectedRecord.lastName ? ` ${selectedRecord.lastName}` : ""),
            mobile1: mobile.trim(),
            mobile: mobile.trim(),
            description: description.trim(),
            shopId: store?.value || selectedRecord.shopId || 0,
            store: store?.label || (selectedRecord.shopId ? `Store ${selectedRecord.shopId}` : ""),
          };

          setRecords((prev) =>
            prev.map((r) =>
              Number(r.deliveryManId) === Number(updatedRecord.deliveryManId)
                ? updatedRecord
                : r
            )
          );
          setSelectedRecord(updatedRecord);
          toast.success("Record updated successfully");
        } else {
          toast.error(res.data.error);
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };

  const deleteRecord = () => {
    const payload = { deliveryManId: selectedRecord.deliveryManId };
    apiService({
      endpoint: apiUrl + "/DeliveryMan/delete",
      method: "POST",
      data: payload,
    })
      .then((res) => {
        if (res.data.success) {
          setRecords((prev) =>
            prev.filter((i) => i.deliveryManId !== selectedRecord.deliveryManId)
          );
          setMode("new");
          setIsRecordTab(true);
          toast.success("Record deleted successfully");
        } else {
          toast.error(res.data.error);
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };

  return (
<>
  {/* First Row */}
  <div className="cityNameContainer">

    {/* Store */}
    <div className="storeContainer">
      <DropDown
        label="Store"
        placeholder="--Select Store--"
        options={"shops"}
        selectedOption={store}
        setSelectedOption={setStore}
      />
    </div>

    {/* Name */}
    <div className="nameContainer">
      <Input
        label="Name"
        important="true"
        inputVal={name}
        setInputVal={setName}
        inputRef={nameRef}
        maxLength={50}
      />
    </div>

    {/* Mobile */}
    <div className="mobileContainer">
      <Input
        label="Mobile No"
        inputVal={mobile}
        setInputVal={(v) => {
          if (/^[0-9]*$/.test(v)) setMobile(v);
        }}
        maxLength={20}
      />
    </div>

  </div>

  {/* Description */}
  <div className="cityCommentContainer">
    <InputComment
      label="Description"
      inputVal={description}
      setInputVal={setDescription}
    />
  </div>

  {/* Buttons */}
  <SaveUpdateBtn
    handleSave={handleSave}
    handleReset={handleReset}
    handleDelete={handleDelete}
    handleUpdate={handleUpdate}
    showUnderLine={true}
    mode={mode}
    disableSave={userRights !== 1 && !userRights.includes("Save")}
    disableUpdate={userRights !== 1 && !userRights.includes("Update")}
    disableDelete={userRights !== 1 && !userRights.includes("Delete")}
  />

  {showModal && (
    <ConfirmationPopup
      setShowModal={setShowModal}
      modalTitle={modalTitle}
      modalBody={modalBody}
      onConfirm={onConfirm}
    />
  )}
</>
  );
}

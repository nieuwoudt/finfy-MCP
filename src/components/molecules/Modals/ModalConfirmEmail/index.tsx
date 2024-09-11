"use client";

import { Modal } from "@/components/atoms";

const ModalConfirmEmail = () => {
  return (
    <Modal
      open={true}
      classes={{
        wrapper: "max-w-lg !absolute",
        container: "flex flex-col gap-4",
      }}
      isDisabledPortal
    >
      <Modal.Header>
        <h3 className="text-white text-2xl text-start font-bold">
          Confirm Email
        </h3>
        <p className="text-blue-gray text-sm font-medium mt-2">
          To complete your registration, please check your email and confirm
          your address. We have sent you a confirmation link.
        </p>
      </Modal.Header>
    </Modal>
  );
};

export { ModalConfirmEmail };

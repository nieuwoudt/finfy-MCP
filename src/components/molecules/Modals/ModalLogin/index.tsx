"use client";

import { Modal, Button, Field } from "@/components/atoms";

const ModalLogin = () => {
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
        <h3 className="text-white text-2xl text-start font-bold">Log in</h3>
        <p className="text-blue-gray text-sm font-medium mt-2">
          To continue, please enter your password.
        </p>
      </Modal.Header>
      <Modal.Body className="flex flex-col gap-4">
        <Field label={"Email"} full />
        <Field label={"Password"} full type="password" />
      </Modal.Body>
      <Modal.Footer className="flex flex-col gap-4 mt-4">
        <Button size="xl" full href="/login" as="link">
          Log in
        </Button>
        <Button size="xl" variant="plain" full href="/sign-up" as="link">
          Sign up
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { ModalLogin };

"use client";

import { Modal, Button } from "@/components/atoms";

const ModalOnboarding = () => {
  return (
    <Modal
      open={true}
      classes={{
        wrapper: "max-w-lg !absolute",
      }}
      isDisabledPortal
    >
      <Modal.Header>
        <h3 className="text-white text-2xl text-center font-bold">
          Get Started
        </h3>
      </Modal.Header>
      <Modal.Footer className="flex gap-4 mt-4">
        <Button size="xl" full href="/login" as="link">
          Log in
        </Button>
        <Button size="xl" full href="/sign-up" as="link">
          Sign up
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { ModalOnboarding };

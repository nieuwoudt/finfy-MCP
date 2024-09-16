import { Dialog, Button, Icon } from "@/components/atoms";
import { TextareaTemplate, SwitchTemplate } from "@/components/molecules";

const PersonalizePop = () => {
  return (
    <Dialog>
      <Dialog.Trigger>Personalization</Dialog.Trigger>
      <Dialog.Content className="text-white bg-navy-25 rounded-none border-none">
        <Dialog.Header>
          <div className="flex items-center">
            <Icon type="SparkleIcon" className="size-6 mr-1" />
            <Dialog.Title className="font-semibold text-2xl">
              Personalization
            </Dialog.Title>
          </div>
          <Dialog.Description className="w-full rounded-sm bg-navy-5 text-base h-11 flex items-center px-2 mb-5">
            Get better AI answers by telling us about yourself.
          </Dialog.Description>
          <br />
          <Dialog.Description className="mt-10">
            <span className="font-semibold font-inter">About you</span> (name,
            hobbies, interests, career, location, etc.)
          </Dialog.Description>
          <TextareaTemplate />
          <br />
          <div className="flex w-full items-center justify-between">
            <Button>Save changes</Button>
            <div className="flex flex-col gap-1 items-end">
              <SwitchTemplate
                label="Enable Personalization"
                id="enable-personalization"
              />
              <SwitchTemplate
                label="Enable Smart learn"
                id="enable-smart-learn"
              />
            </div>
          </div>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog>
  );
};

export { PersonalizePop };

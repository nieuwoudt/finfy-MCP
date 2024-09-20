import { Dialog, Button, Icon } from "@/components/atoms";
import { TextareaTemplate, SwitchTemplate } from "@/components/molecules";

const PersonalizePop = () => {
  return (
    <Dialog>
      <Dialog.Trigger className="text-sm">Personalization</Dialog.Trigger>
      <Dialog.Content className="text-white bg-navy-25 rounded-none border-none pt-4">
        <Icon
          type="QuestionMarkCircle"
          className="absolute top-3.5 right-10 cursor-pointer"
        />
        <Dialog.Header className="mb-0">
          <div className="flex items-center">
            <Icon type="SparkleIcon" className="mr-1 h-6 w-6 stroke-white" />
            <Dialog.Title className="font-semibold text-2xl">
              Personalization
            </Dialog.Title>
          </div>
        </Dialog.Header>

        <Dialog.Description className="w-full rounded-sm bg-navy-5 text-base flex font-normal items-center p-3">
          Get better AI answers by telling us about yourself.
        </Dialog.Description>
        <Dialog.Description className="!mt-8 mb-2">
          <span className="font-semibold font-inter">About you</span> (name,
          hobbies, interests, career, location, etc.)
        </Dialog.Description>
        <TextareaTemplate />
        <div className="flex w-full items-center justify-between !mt-12">
          <Button size="xl">Save changes</Button>
          <div className="flex flex-col gap-2 items-end">
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
      </Dialog.Content>
    </Dialog>
  );
};

export { PersonalizePop };

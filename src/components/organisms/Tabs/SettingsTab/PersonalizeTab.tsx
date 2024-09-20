import { SwitchTemplate, TextareaTemplate } from "@/components/molecules";
import { Icon, Button } from "@/components/atoms";

const PersonalizeTab = () => {
  return (
    <div className="my-9">
      <div className="p-3 border rounded-md bg-navy-15 border-navy-5">
        <div className="text-white rounded-none border-none pt-4">
          <Icon
            type="QuestionMarkCircle"
            className="absolute top-3.5 right-10 cursor-pointer"
          />
          <div className="mb-0">
            <div className="flex items-center">
              <Icon type="SparkleIcon" className="mr-1 h-6 w-6 stroke-white" />
              <h3 className="font-semibold text-2xl">Personalization</h3>
            </div>
          </div>

          <p className="w-full rounded-sm bg-navy-5 text-base flex font-normal items-center p-3">
            Get better AI answers by telling us about yourself.
          </p>
          <p className="!mt-8 mb-2">
            <span className="font-semibold font-inter">About you</span> (name,
            hobbies, interests, career, location, etc.)
          </p>
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
        </div>
      </div>
    </div>
  );
};
export { PersonalizeTab };

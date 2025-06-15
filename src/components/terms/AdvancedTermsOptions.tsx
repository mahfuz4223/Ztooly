
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdvancedTermsOptions = {
  returns: boolean;
  liability: boolean;
  governingLaw: boolean;
  dataUse: boolean;
  cookies: boolean;
  termination: boolean;
  disclaimer: boolean;
  customSection: string;
};

type Props = {
  options: AdvancedTermsOptions;
  onChange: (options: AdvancedTermsOptions) => void;
};

export default function AdvancedTermsOptions({ options, onChange }: Props) {
  function set<K extends keyof AdvancedTermsOptions>(k: K, v: AdvancedTermsOptions[K]) {
    onChange({ ...options, [k]: v });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-4 mb-2">
        <Label className="flex items-center gap-2">
          <Switch checked={options.returns} onCheckedChange={v => set("returns", v)} />
          Returns/Refund Policy
        </Label>
        <Label className="flex items-center gap-2">
          <Switch checked={options.liability} onCheckedChange={v => set("liability", v)} />
          Limitation of Liability
        </Label>
        <Label className="flex items-center gap-2">
          <Switch checked={options.governingLaw} onCheckedChange={v => set("governingLaw", v)} />
          Governing Law
        </Label>
        <Label className="flex items-center gap-2">
          <Switch checked={options.dataUse} onCheckedChange={v => set("dataUse", v)} />
          Data Use & Privacy
        </Label>
        <Label className="flex items-center gap-2">
          <Switch checked={options.cookies} onCheckedChange={v => set("cookies", v)} />
          Cookies
        </Label>
        <Label className="flex items-center gap-2">
          <Switch checked={options.termination} onCheckedChange={v => set("termination", v)} />
          Termination
        </Label>
        <Label className="flex items-center gap-2">
          <Switch checked={options.disclaimer} onCheckedChange={v => set("disclaimer", v)} />
          Disclaimer
        </Label>
      </div>
      <div>
        <Label htmlFor="customSection" className="block mb-1 text-xs">
          Custom Section
        </Label>
        <Input
          id="customSection"
          placeholder="Write your own clause (optional)"
          value={options.customSection}
          onChange={e => set("customSection", e.target.value)}
          className="text-xs"
        />
      </div>
    </div>
  );
}

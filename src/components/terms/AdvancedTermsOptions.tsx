
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
  ipRights: boolean;
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
      <div>
        <p className="mb-2 text-sm font-semibold text-muted-foreground">Core Policies</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.returns} onCheckedChange={v => set("returns", v)} />
            Returns/Refunds
          </Label>
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.liability} onCheckedChange={v => set("liability", v)} />
            Limitation of Liability
          </Label>
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.disclaimer} onCheckedChange={v => set("disclaimer", v)} />
            Disclaimer
          </Label>
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.termination} onCheckedChange={v => set("termination", v)} />
            Termination
          </Label>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-muted-foreground">Data, Privacy & IP</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.dataUse} onCheckedChange={v => set("dataUse", v)} />
            Data Use & Privacy
          </Label>
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.cookies} onCheckedChange={v => set("cookies", v)} />
            Cookies
          </Label>
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.ipRights} onCheckedChange={v => set("ipRights", v)} />
            Intellectual Property
          </Label>
        </div>
      </div>
      
      <div>
        <p className="mb-2 text-sm font-semibold text-muted-foreground">Legal</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Label className="flex items-center gap-1 text-xs">
            <Switch checked={options.governingLaw} onCheckedChange={v => set("governingLaw", v)} />
            Governing Law
          </Label>
        </div>
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

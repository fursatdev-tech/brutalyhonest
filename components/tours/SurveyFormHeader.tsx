interface Props {
  title: string;
  subtitle?: string;
  required?: boolean;
}

const SurveyFormHeader = ({ title, subtitle, required = false }: Props) => {
  return (
    <div className="space-y-1 px-6 pt-6">
      <p className="text-xl font-bold">
        {title}
        {required && <span className="text-primary">*</span>}
      </p>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
    </div>
  );
};

export default SurveyFormHeader;

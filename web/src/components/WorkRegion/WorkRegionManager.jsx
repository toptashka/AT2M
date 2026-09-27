import WorkRegionUser from "./WorkRegionUser";

export default function WorkRegionManager(props) {
  return (
    <WorkRegionUser
      {...props}
      manager={props.manager ?? true}
    />
  );
}
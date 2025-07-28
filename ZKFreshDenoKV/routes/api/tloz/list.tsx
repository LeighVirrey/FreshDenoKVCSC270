import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import CharacterList from "../../../islands/CharacterList.tsx";


export default defineRoute((_req, _ctx) => {
  return (
    <Partial name="tloz-content">
      <CharacterList />
    </Partial>
  );
});

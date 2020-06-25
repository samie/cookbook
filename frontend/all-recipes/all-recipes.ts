import { TextFieldElement } from "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-text-field";
import {
  css,
  customElement,
  html,
  LitElement,
  property,
  query,
} from "lit-element";
import { repeat } from "lit-html/directives/repeat";
import RecipeInfo from "../generated/com/vaadin/recipes/data/RecipeInfo";
import * as RecipeEndpoint from "../generated/RecipeEndpoint";
import { tsRecipeRoutes } from "../ts-recipes";

@customElement("all-recipes")
export class AllRecipes extends LitElement {
  @property({ type: String })
  filter: string = "";
  @property({ type: Array })
  recipes: RecipeInfo[] = [];

  updateFilter = this.doUpdateFilter.bind(this);

  @query("#filterField")
  filterField: TextFieldElement | undefined;

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1em;
      }
    `;
  }

  render() {
    return html`
      <h1>How do I...</h1>
      <vaadin-text-field
        id="filterField"
        @value-changed="${this.updateFilter}"
        placeholder="Filter..."
      ></vaadin-text-field>

      <ul>
        ${repeat(
          this.recipes.filter((recipe) =>
            recipe.howDoI.toLowerCase().includes(this.filter)
          ),
          (recipe) => recipe.url,
          (recipe) =>
            html`<li><a href="${recipe.url}">${recipe.howDoI}</a></li>`
        )}
      </ul>
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.recipes = tsRecipeRoutes.map((route) => route.info);
    this.recipes = [...this.recipes, ...(await RecipeEndpoint.list())];
  }
  doUpdateFilter() {
    this.filter = this.filterField?.value.toLowerCase() || "";
  }
}

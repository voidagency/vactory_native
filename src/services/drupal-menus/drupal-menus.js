import { DrupalService } from "../drupal-client/client.service";
import { AuthStoreService } from "../auth-manager.service"

export class DrupalMenus {
  async fetchMenu({ name, locale }) {
    const auth = AuthStoreService.getUser()
    const uid = auth?.profile?.uid || 0;
    const cacheKey = `config_system_menu_${name}__user_${uid}__language_${locale}`;

    let options = {
      withCache: true,
      cacheKey: cacheKey,
    };

    if (auth?.profile?.uid > 0) {
      options["withAuth"] = () => `Bearer ${auth?.access_token}`;
      options["headers"] = {
        "X-Auth-Provider": auth?.provider,
      };
    }

    const data = await DrupalService.getMenu(name, locale, options);
    return data;
  }

  formatMenu(name, data) {
    return {
        name,
        items: data?.items || [],
      };
  }

  async getMenu (name, locale) {
    return this.fetchMenu({ name, locale }).then((res) => this.formatMenu(name, res));
  };
  
  async getMenus (names = [], locale) {
    const requests = names.map((name) =>
      this.fetchMenu({ name, locale }).then((res) => this.formatMenu(name, res))
    );
    return Promise.all(requests);
  };

}

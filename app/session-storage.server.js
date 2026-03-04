import { Session } from "@shopify/shopify-api";
import { supabase } from "./supabase.server";

// Custom Supabase session storage for Shopify App Bridge
export class SupabaseSessionStorage {
  constructor() {
    this.tableName = "shopify_sessions";
  }

  async storeSession(session) {
    const sessionData = {
      id: session.id,
      shop: session.shop,
      state: session.state,
      is_online: session.isOnline,
      scope: session.scope,
      expires: session.expires ? session.expires.toISOString() : null,
      access_token: session.accessToken,
      user_id: session.onlineAccessInfo?.associated_user?.id,
      user_first_name: session.onlineAccessInfo?.associated_user?.first_name,
      user_last_name: session.onlineAccessInfo?.associated_user?.last_name,
      user_email: session.onlineAccessInfo?.associated_user?.email,
      user_email_verified: session.onlineAccessInfo?.associated_user?.email_verified,
      account_owner: session.onlineAccessInfo?.associated_user?.account_owner,
      locale: session.onlineAccessInfo?.associated_user?.locale,
      collaborator: session.onlineAccessInfo?.associated_user?.collaborator,
    };

    const { error } = await supabase
      .from(this.tableName)
      .upsert(sessionData, { onConflict: "id" });

    if (error) {
      throw new Error(`Failed to store session: ${error.message}`);
    }

    return true;
  }

  async loadSession(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return undefined;
    }

    const session = new Session({
      id: data.id,
      shop: data.shop,
      state: data.state,
      isOnline: data.is_online,
      scope: data.scope,
      expires: data.expires ? new Date(data.expires) : undefined,
      accessToken: data.access_token,
    });

    if (data.user_id) {
      session.onlineAccessInfo = {
        associated_user: {
          id: data.user_id,
          first_name: data.user_first_name,
          last_name: data.user_last_name,
          email: data.user_email,
          email_verified: data.user_email_verified,
          account_owner: data.account_owner,
          locale: data.locale,
          collaborator: data.collaborator,
        },
      };
    }

    return session;
  }

  async deleteSession(id) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete session: ${error.message}`);
    }

    return true;
  }

  async deleteSessions(ids) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .in("id", ids);

    if (error) {
      throw new Error(`Failed to delete sessions: ${error.message}`);
    }

    return true;
  }

  async findSessionsByShop(shop) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("shop", shop);

    if (error) {
      return [];
    }

    return data.map((sessionData) => {
      const session = new Session({
        id: sessionData.id,
        shop: sessionData.shop,
        state: sessionData.state,
        isOnline: sessionData.is_online,
        scope: sessionData.scope,
        expires: sessionData.expires ? new Date(sessionData.expires) : undefined,
        accessToken: sessionData.access_token,
      });

      if (sessionData.user_id) {
        session.onlineAccessInfo = {
          associated_user: {
            id: sessionData.user_id,
            first_name: sessionData.user_first_name,
            last_name: sessionData.user_last_name,
            email: sessionData.user_email,
            email_verified: sessionData.user_email_verified,
            account_owner: sessionData.account_owner,
            locale: sessionData.locale,
            collaborator: sessionData.collaborator,
          },
        };
      }

      return session;
    });
  }
}

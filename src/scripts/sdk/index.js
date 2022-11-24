import { createClient } from "@supabase/supabase-js";
import config from '../config/app.config';
import useSDK from "./sdk";

const supabase = createClient(config.supabase.url, config.supabase.key);

export const service = useSDK({ supabase });
